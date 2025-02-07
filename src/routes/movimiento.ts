import { Router } from "express";
import {
  createmovimientos_mercaderia,
  getMovimientoDetalle,
  getmovimientos_mercaderia,
  getmovimientos_mercaderia_tipo,
} from "../controller/movimientos_mercaderia";
import { validateToken } from "../middleware/validateToken";

const router = Router();

// Middleware para validar que el usuario tiene el rol de 'administrador'
const Validate = validateToken(["administrador"]);
router.use(Validate);

// Rutas revisadas

// Obtener todos los movimientos de mercadería registrados en el sistema
router.get("/", getmovimientos_mercaderia);

// Obtener todos los movimientos de mercadería registrados en el sistema por tipo
router.get("/:tipo", getmovimientos_mercaderia_tipo);

// Obtener todos los movimientos de mercadería detallado usando el movimiento id indicando el tipo de movimiento deseado
router.get("/detalle/:movimiento_id", getMovimientoDetalle);

// Crear un nuevo movimiento de mercadería (por ejemplo, ingreso o egreso de productos)
router.post("/create", createmovimientos_mercaderia);


// Actualizar un movimiento de mercadería por su ID (ruta sin implementar)
router.put("/update/:movimiento_id");

// Eliminar un movimiento de mercadería por su ID (ruta sin implementar)
router.delete("/delete/:movimiento_id");

export { router };
