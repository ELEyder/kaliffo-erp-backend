import { createAlmacenes } from "./almacen";
import { createColores } from "./color";
import { createProducto } from "./producto";
import { createTelas } from "./tela";
import { createTienda } from "./tienda";
import { createTrabajadores } from "./trabajador";
import { createUsuarios } from "./usuario";

export const initSeeders = async () => {
  await createTienda();
  await createTrabajadores();
  await createColores();
  await createAlmacenes();
  await createProducto();
  await createUsuarios();
  // await createTelas();
  // await createLotes();
};
