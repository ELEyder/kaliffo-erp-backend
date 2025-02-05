// Importa las dependencias necesarias
import { Router } from "express"; // Router para definir rutas
import {
  createAlmacen_Productos,
  getAlmacenProducto,
  getAlmacenProductos,
} from "../controller/almacen_productos"; // Controladores para las operaciones del almacén

// Crea una instancia del enrutador
const router = Router();

// Define las rutas
// Ruta para obtener productos del almacén
router.get("/", getAlmacenProductos);

//ruta para obtener los productos usando el id
router.get("/:almacen_id",getAlmacenProducto)

// Ruta para crear un nuevo producto en el almacén
router.post("/create", createAlmacen_Productos);

// Exporta el enrutador
export { router };
