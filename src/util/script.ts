import sequelize from "../db/connection";
import { Color as ColorInterface } from "../interface/color";
import { Producto as ProductoInterface } from "../interface/producto";
import { Tienda as TiendaInterface } from "../interface/tienda";
import { Usuario as UsuarioInterface } from "../interface/usuario";
import { Color } from "../models/color";
import { Horario } from "../models/horario";
import { Producto } from "../models/producto";
import { Tienda } from "../models/tienda";
import { Usuario } from "../models/usuario";
import { _createColor } from "../service/color";
import { _createProducto } from "../service/producto";
import { _createTienda } from "../service/tienda";
import { _createUsuario } from "../service/usuario";

const tiendas: TiendaInterface[] = [
  {
    tienda: "Almacen",
    direccion: "Av. Siempre Viva 123, Lima",
    telefono: "987654321",
  },
  {
    tienda: "Tienda 1",
    direccion: "Av. Siempre Viva 123, Lima",
    telefono: "987654321",
  },
  {
    tienda: "Tienda 2",
    direccion: "Calle Los Cedros 456, Arequipa",
    telefono: "912345678",
  },
];

const usuarios: UsuarioInterface[] = [
  {
    nombre: "Juan",
    ap_paterno: "Pérez",
    ap_materno: "Gómez",
    fecha_nacimiento: "2000-01-01",
    dni: "73214567",
    telefono: "987654321",
    contraseña: "juan1234",
    rol: 1,
  },
  {
    nombre: "María",
    ap_paterno: "López",
    ap_materno: "Hernández",
    fecha_nacimiento: "1992-07-02",
    dni: "65478932",
    telefono: "912345678",
    contraseña: "maria2021",
    rol: 2,
    tienda_id: 2,
  },
  {
    nombre: "Carlos",
    ap_paterno: "Fernández",
    ap_materno: "Ramírez",
    fecha_nacimiento: "1978-11-08",
    dni: "87654321",
    telefono: "976543210",
    contraseña: "carlos78",
    rol: 2,
    tienda_id: 1,
  },
  {
    nombre: "Lucía",
    ap_paterno: "García",
    ap_materno: "Mendoza",
    fecha_nacimiento: "1995-05-15",

    dni: "78945612",
    telefono: "934567890",
    contraseña: "lucia95",
    rol: 2,
    tienda_id: 2,
  },
];

const colores: ColorInterface[] = [
  { nombre: "Rojo", codigo: "FF0000" },
  { nombre: "Verde", codigo: "00FF00" },
  { nombre: "Azul", codigo: "0000FF" },
  { nombre: "Amarillo", codigo: "FFFF00" },
  { nombre: "Naranja", codigo: "FFA500" },
  { nombre: "Violeta", codigo: "EE82EE" },
  { nombre: "Negro", codigo: "000000" },
  { nombre: "Blanco", codigo: "FFFFFF" },
  { nombre: "Gris", codigo: "808080" },
  { nombre: "Marrón", codigo: "A52A2A" },
  { nombre: "Rosa", codigo: "FFC0CB" },
  { nombre: "Celeste", codigo: "87CEEB" },
  { nombre: "Cian", codigo: "00FFFF" },
  { nombre: "Magenta", codigo: "FF00FF" },
  { nombre: "Dorado", codigo: "FFD700" },
  { nombre: "Plateado", codigo: "C0C0C0" },
  { nombre: "Púrpura", codigo: "800080" },
  { nombre: "Azul Marino", codigo: "000080" },
  { nombre: "Verde Oliva", codigo: "808000" },
  { nombre: "Lavanda", codigo: "E6E6FA" },
  { nombre: "Turquesa", codigo: "40E0D0" },
  { nombre: "Salmón", codigo: "FA8072" },
  { nombre: "Aguamarina", codigo: "7FFFD4" },
  { nombre: "Coral", codigo: "FF7F50" },
  { nombre: "Caqui", codigo: "F0E68C" },
  { nombre: "Azul Cobalto", codigo: "0047AB" },
  { nombre: "Verde Lima", codigo: "32CD32" },
  { nombre: "Marfil", codigo: "FFFFF0" },
  { nombre: "Fucsia", codigo: "FF00FF" },
  { nombre: "Verde Menta", codigo: "98FF98" },
];

const productos: any[] = [
  {
    nombre: "Jeans Slim Fit",
    precio: 49.99,
    descuento: 10,
    detalles: [
      {
        codigo: "j001",
        talla: "32",
        color_id: 1,
        tiendas: [
          {
            tienda_id: 1,
            stock: 20,
          },
          {
            tienda_id: 2,
            stock: 30,
          },
        ],
      },
      {
        codigo: "j002",
        talla: "34",
        color_id: 1,
        tiendas: [
          {
            tienda_id: 1,
            stock: 15,
          },
          {
            tienda_id: 2,
            stock: 25,
          },
        ],
      },
    ],
  },
  {
    nombre: "Jeans Regular Fit",
    precio: 54.99,
    descuento: 5,
    detalles: [
      {
        codigo: "j003",
        talla: "32",
        color_id: 2,
        tiendas: [
          {
            tienda_id: 1,
            stock: 18,
          },
          {
            tienda_id: 2,
            stock: 28,
          },
        ],
      },
      {
        codigo: "j004",
        talla: "34",
        color_id: 2,
        tiendas: [
          {
            tienda_id: 1,
            stock: 12,
          },
          {
            tienda_id: 2,
            stock: 22,
          },
        ],
      },
    ],
  },
  {
    nombre: "Jeans Relaxed Fit",
    precio: 59.99,
    descuento: 15,
    detalles: [
      {
        codigo: "j005",
        talla: "36",
        color_id: 3,
        tiendas: [
          {
            tienda_id: 1,
            stock: 25,
          },
          {
            tienda_id: 2,
            stock: 35,
          },
        ],
      },
      {
        codigo: "j006",
        talla: "38",
        color_id: 3,
        tiendas: [
          {
            tienda_id: 1,
            stock: 20,
          },
          {
            tienda_id: 2,
            stock: 30,
          },
        ],
      },
    ],
  },
  {
    nombre: "Jeans Skinny Fit",
    precio: 44.99,
    descuento: 20,
    detalles: [
      {
        codigo: "j007",
        talla: "30",
        color_id: 4,
        tiendas: [
          {
            tienda_id: 1,
            stock: 22,
          },
          {
            tienda_id: 2,
            stock: 32,
          },
        ],
      },
      {
        codigo: "j008",
        talla: "32",
        color_id: 4,
        tiendas: [
          {
            tienda_id: 1,
            stock: 18,
          },
          {
            tienda_id: 2,
            stock: 28,
          },
        ],
      },
    ],
  },
  {
    nombre: "Jeans Bootcut",
    precio: 69.99,
    descuento: 25,
    detalles: [
      {
        codigo: "j009",
        talla: "34",
        color_id: 5,
        tiendas: [
          {
            tienda_id: 1,
            stock: 30,
          },
          {
            tienda_id: 2,
            stock: 40,
          },
        ],
      },
      {
        codigo: "j010",
        talla: "36",
        color_id: 5,
        tiendas: [
          {
            tienda_id: 1,
            stock: 28,
          },
          {
            tienda_id: 2,
            stock: 38,
          },
        ],
      },
    ],
  },
  {
    nombre: "Jeans Slim Fit12",
    precio: 49.99,
    descuento: 10,
    detalles: [
      {
        codigo: "j001",
        talla: "32",
        color_id: 1,
        tiendas: [
          {
            tienda_id: 1,
            stock: 20,
          },
          {
            tienda_id: 3,
            stock: 30,
          },
        ],
      },
      {
        codigo: "j002",
        talla: "34",
        color_id: 1,
        tiendas: [
          {
            tienda_id: 1,
            stock: 15,
          },
          {
            tienda_id: 3,
            stock: 25,
          },
        ],
      },
    ],
  },
];

export const scriptInicio = async () => {
  for (const tienda of tiendas) {
    const tiendaExistente = await Tienda.findOne({
      where: { tienda: tienda.tienda },
    });
    if (!tiendaExistente) {
      await _createTienda(tienda);
    }
  }

  for (const usuario of usuarios) {
    const usuarioExistente = await Usuario.findOne({
      where: { dni: usuario.dni },
    });
    if (!usuarioExistente) {
      await _createUsuario(usuario);
    }
  }

  if (!(await Horario.findOne({ where: { usuario_id: 1 } }))) {
    sequelize.query(`
      insert into horario(hora_entrada,hora_salida,fecha,usuario_id) values 
      ("9:00:00", "16:00:00","2024-08-20",1),
      ("9:00:00", "17:00:00","2024-08-19",1),
      ("9:00:00", "14:00:00","2024-08-18",1),
      ("9:00:00", "12:00:00","2024-08-14",1);`);
  }

  for (const color of colores) {
    const colorExistente = await Color.findOne({
      where: { nombre: color.nombre },
    });

    const newColor = {
      nombre: color.nombre,
      codigo: color.codigo,
    };
    if (!colorExistente) {
      await _createColor(newColor);
    }
  }

  for (const producto of productos) {
    const productoExistente = await Producto.findOne({
      where: { nombre: producto.nombre },
    });
    if (!productoExistente) {
      const newProducto: ProductoInterface = {
        nombre: producto.nombre,
        precio: producto.precio,
        descuento: producto.descuento,
        stockGeneral: 0,
      };

      await _createProducto(newProducto, producto.detalles);
    }
  }
};
