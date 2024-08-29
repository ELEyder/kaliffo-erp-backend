import { Usuario as UsuarioInterface } from "../interface/usuario";
import { Horario } from "../models/horario";
import { Usuario } from "../models/usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";
import { Rol } from "../models/rol";
import { Tienda } from "../models/tienda";
import sequelize from "../db/connection";
dotenv.config();

export const _createUsuario = async (usuario: UsuarioInterface) => {
  try {
    if (await Usuario.findOne({ where: { dni: usuario.dni } })) {
      return {
        msg: "este dni ya esta en uso",
        succes: false,
        status: 400,
      };
    }

    if (!(await Rol.findOne({ where: { rol_id: usuario.rol_id } }))) {
      return {
        msg: "Este rol no existes",
        succes: false,
        status: 400,
      };
    }

    if (usuario.tienda_id) {
      if (
        !(await Tienda.findOne({ where: { tienda_id: usuario.tienda_id } }))
      ) {
        return {
          msg: "Esta tienda no existe",
          succes: false,
          status: 400,
        };
      }
    }

    const hashPassword = await bcrypt.hash(usuario.contraseña, 8);
    usuario.contraseña = hashPassword;

    const newUsuario = await Usuario.create(usuario);

    return {
      msg: newUsuario,
      succes: true,
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      error: "_createUsuario",
      succes: false,
      status: 400,
    };
  }
};

export const _getUsuarios = async (
  inicio?: number,
  final?: number,
  nombre?: string,
  rol_id?: number
) => {
  try {
    console.log(rol_id);

    const filtros: any = {
      include: {
        model: Tienda,
        attributes: ["tienda_id", "tienda"],
      },
      where: {},
      offset: inicio || 0,
      limit: final ? final - (inicio || 0) : undefined,
    };

    if (nombre) {
      filtros.where.nombre = { [Op.like]: `%${nombre}%` };
    }

    if (rol_id) {
      filtros.where.rol_id = rol_id;
    }

    const items = await Usuario.findAll(filtros);

    // Transform the result to flatten the tienda attributes
    const transformedItems = items.map((item: any) => {
      const tienda = item.tienda;
      return {
        ...item.toJSON(), // Convert the Sequelize instance to a plain object
        tienda_id: tienda ? tienda.tienda_id : null,
        tienda: tienda ? tienda.tienda : null,
      };
    });

    return {
      items: transformedItems,
      succes: true,
      status: 200,
    };
  } catch (error) {
    return {
      error: "_getUsuarios",
      succes: false,
      status: 400,
    };
  }
};

export const _getUsuario = async (dni: string) => {
  console.log("dasd");

  try {
    const item = await Usuario.findOne({
      where: { dni: dni },
    });

    if (!item) {
      return {
        msg: "No se encontro usuario con este dni",
        succes: false,
        status: 400,
      };
    }

    return {
      item,
      succes: true,
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      error: "_getUsuario",
      succes: false,
      status: 400,
    };
  }
};

export const _deleteUsuario = async (dni: string) => {
  try {
    const usuario = await Usuario.findOne({ where: { dni } });

    if (!usuario) {
      return {
        msg: "No existe usuario con este DNI",
        success: false,
        status: 404,
      };
    }

    await usuario.destroy();

    return {
      msg: "usuario eliminado",
      success: true,
      status: 200,
    };
  } catch (error) {
    return {
      msg: "_deleteUsuario",
      success: false,
      status: 500,
    };
  }
};

export const _updateUsuario = async (usuario: Partial<UsuarioInterface>) => {
  try {
    const updateUsuario = await Usuario.findOne({
      where: { usuario_id: usuario.usuario_id },
    });

    if (!updateUsuario) {
      return {
        msg: "No se encontró un usuario con este DNI",
        success: false,
        status: 404,
      };
    }

    await updateUsuario.update(usuario);

    return {
      msg: updateUsuario,
      success: true,
      status: 200,
    };
  } catch (error) {
    return {
      msg: "_updateUsuario",
      success: false,
      status: 500,
    };
  }
};

export const _login = async (dni: string, contraseña: string) => {
  try {
    const usuario = await Usuario.findOne({
      where: { dni: dni },
    });

    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
      return {
        msg: "dni o contraseña incorrecto",
        succes: false,
        status: 400,
      };
    }

    const token = jwt.sign(
      {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        dni: usuario.dni,
      },
      process.env.SECRET_KEY || "as"
    );

    return {
      msg: `bienvenido ${usuario.nombre}`,
      token,
      succes: true,
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      msg: "_login",
      succes: false,
      status: 400,
    };
  }
};

export const _horaEntrada = async (usuario_id: number) => {
  try {
    const now = new Date();
    const fecha = now.toLocaleDateString("en-CA");
    const horaEntrada = now.toLocaleTimeString("en-US", { hour12: false });

    const asistenciaExistente = await Horario.findOne({
      where: { fecha: fecha },
    });

    if (asistenciaExistente?.hora_salida === null) {
      return {
        msg: "Asistencia sin terminar",
        asistenciaExistente,
        succes: false,
        status: 400,
      };
    }

    const newHorario = await Horario.create({
      hora_entrada: horaEntrada,
      hora_salida: null,
      fecha: fecha,
      usuario_id,
    });

    return {
      msg: newHorario,
      succes: true,
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      msg: "_horaEntrada",
      succes: false,
      status: 400,
    };
  }
};

export const _horaSalida = async (usuario_id: number) => {
  const now = new Date();
  const fecha = now.toLocaleDateString("en-CA");
  const horaSalida = now.toLocaleTimeString("en-US", { hour12: false });

  const asistencia = await Horario.findOne({
    where: { usuario_id: usuario_id, fecha: fecha, hora_salida: null },
  });

  if (!asistencia) {
    return {
      msg: "Iniciar asistencia primero",
      succes: false,
      status: 400,
    };
  }

  asistencia.hora_salida = horaSalida;
  await asistencia.save();

  return {
    msg: asistencia,
    succes: true,
    status: 200,
  };
};

export const _horasTrabajadas = async (
  usuario_id: number,
  fechaInicio: string,
  fechaFin: string
) => {
  const horasTrabajadas = await Horario.findAll({
    where: {
      usuario_id: usuario_id,
      fecha: {
        [Op.between]: [fechaFin, fechaInicio],
      },
    },
    attributes: [
      [
        sequelize.fn(
          "SUM",
          sequelize.literal("TIMESTAMPDIFF(HOUR, hora_entrada, hora_salida)")
        ),
        "totalHoras",
      ],
    ],
    raw: true,
  });

  return {
    msg: horasTrabajadas,
    success: true,
    status: 200,
  };
};
