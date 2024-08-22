import express from "express";
import cors from "cors";
import { router } from "../routes";
import { Categoria } from "./categoria";
import { Cliente } from "./cliente";
import { Producto } from "./producto";
import { Venta } from "./venta";
import { DetalleVenta } from "./detalleVenta";
import { Puesto } from "./puesto";
import { Tienda } from "./tienda";
import { Usuario } from "./usuario";
import { Horario } from "./horario";
import cookieParser from "cookie-parser";

class Serve {
  app: express.Application;
  PORT: string;

  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || "";

    this.listen();
    this.midddlewares();
    this.route();
    this.db();
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`Ejecutandose en el puerto ${this.PORT}`);
    });
  }

  midddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());
  }

  route() {
    this.app.use(router);
  }

  async db() {
    try {
      await Categoria.sync();
      await Puesto.sync();
      await Tienda.sync();
      await Usuario.sync();
      await Horario.sync();

      // await Cliente.sync();
      // await Producto.sync();
      // await Venta.sync();
      // await DetalleVenta.sync();
    } catch (error) {
      console.log(error);
    }
  }
}

export default Serve;
