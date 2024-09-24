import { Request, Response } from "express";
import { Usuario } from "../interface/usuario";
import {
  _createUsuario,
  _deleteUsuario,
  _getUsuario,
  _getUsuarios,
  _horaEntrada,
  _horaSalida,
  _horasTrabajadas,
  _login,
  _updateUsuario,
} from "../service/usuario";
import { handleHttp } from "../util/error.handler";

export const createUsuario = async (req: Request, res: Response) => {
  const {
    nombre,
    ap_paterno,
    ap_materno,
    fecha_nacimiento,
    dni,
    telefono,
    contraseña,
    tienda_id,
    rol,
  } = req.body;

  const newUsuario: Usuario = {
    nombre,
    ap_paterno,
    ap_materno,
    fecha_nacimiento,
    dni,
    telefono,
    contraseña,
    tienda_id,
    rol,
  };

  try {
    const response = await _createUsuario(newUsuario);
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_createUsuario");
  }
};

export const getUsuarios = async (req: Request, res: Response) => {
  const rol = req.query.rol;
  const inicio = req.query.inicio;
  const final = req.query.final;
  const nombre = req.query.nombre as string;
  const tienda_id = req.query.tienda_id;
  const antiTienda_id = req.query.antiTienda_id as string;

  try {
    const response = await _getUsuarios(
      Number(inicio),
      Number(final),
      nombre,
      Number(rol),
      Number(tienda_id),
      Number(antiTienda_id)
    );
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error_getUsuarios", 500);
  }
};

export const getUsuario = async (req: Request, res: Response) => {
  const { usuario_id } = req.params;

  try {
    const response = await _getUsuario(usuario_id);
    res.status(response.status).json(response.item ? response.item : response);
  } catch (error) {
    handleHttp(res, "error_getUsuario", 500);
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const { usuario_id } = req.params;

  try {
    const response = await _deleteUsuario(usuario_id);
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_deleteUsuario", 500);
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  const { usuario_id } = req.params;
  const {
    nombre,
    ap_paterno,
    ap_materno,
    fecha_nacimiento,
    dni,
    telefono,
    tienda_id,
    rol,
  } = req.body;

  const updateUsuario: Partial<Usuario> = {
    usuario_id: Number(usuario_id),
    nombre,
    ap_paterno,
    ap_materno,
    fecha_nacimiento,
    dni,
    telefono,
    tienda_id,
    rol,
  };

  try {
    const response = await _updateUsuario(updateUsuario);
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_updateUsuario", 500);
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  const { dni, contraseña } = req.body;

  try {
    const response = await _login(dni, contraseña);
    res.cookie("token", response.token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    });

    delete response.token;
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_loginUsusrio", 500);
  }
};

export const inicioAsistencia = async (req: Request, res: Response) => {
  const usuario_id = req.decodeToken.usuario_id;

  try {
    const response = await _horaEntrada(usuario_id);
    res.status(response.status).json(response);
    // res.status(200).json("das");
  } catch (error) {
    handleHttp(res, "error_iniciarAsistencia", 500);
  }
};

export const finalAsitencia = async (req: Request, res: Response) => {
  const usuario_id = req.decodeToken.usuario_id;
  try {
    const response = await _horaSalida(usuario_id);
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_finalAsistencia", 500);
  }
};

export const horasTrabajadas = async (req: Request, res: Response) => {
  const { usuario_id, fecha_inicio, fecha_final } = req.body;

  try {
    const response = await _horasTrabajadas(
      Number(usuario_id),
      fecha_final,
      fecha_inicio
    );
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_horasTrabajadas", 500);
  }
};
