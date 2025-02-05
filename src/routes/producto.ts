import { Router } from "express";
import {
  activarProducto,
  createProducto,
  desactivarProducto,
  getColoresProducto,
  getDetalleProducto,
  getProducto,
  getProductos,
  getProductoSimpleCodigo,
  getTallaProducto,
  Imprimir,
  updateProducto,
} from "../controller/producto";
import { ValidateCreateProducto } from "../validation/producto";
import { validateToken } from "../middleware/validateToken";
import { imprimirCodigos } from "../controller/telas";

const router = Router();

// Middleware para validar que el usuario tiene los roles de 'administrador' o 'venta'
const Validate = validateToken(["administrador", "venta"]);
router.use(Validate);

// Rutas revisadas

// Obtener todos los productos
router.get("/", getProductos);

// Obtener detalles específicos de un producto usando el 'producto_id'
router.get("/detalle/:producto_id", getDetalleProducto);

// Obtener tallas de un producto usando el 'detalle_id'
router.get("/talla/:detalle_id", getTallaProducto);

//obtener codigos de barras
router.get("/imprimir/:lote_id",Imprimir)

//obtener producto detalle usando codigo de barras
router.get("/codigo_simple/:codigo",getProductoSimpleCodigo)

// Obtener colores disponibles para un producto usando el 'producto_id'
router.get("/colores/:producto_id", getColoresProducto);

// Obtener información de un producto específico usando su 'producto_id'
router.get("/:producto_id", getProducto);

// Crear un nuevo producto (con validación)
router.post("/create", ValidateCreateProducto, createProducto);

// Actualizar información de un producto específico usando el 'producto_id'
router.put("/update/:producto_id", updateProducto);

// Desactivar un producto usando el 'producto_id'
router.put("/desactivar/:producto_id", desactivarProducto);

// Activar un producto que estaba desactivado usando el 'producto_id'
router.put("/activar/:producto_id", activarProducto);

export { router };
