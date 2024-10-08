import { Router } from "express";
import {
  createProducto,
  createProductoCompleto,
  deleteProducto,
  getColoresProducto,
  getDetalleProducto,
  // getColoresProducto,
  getProducto,
  getProductos,
  getProductosTienda,
  getTallaProducto,
  loseProducto,
  // loseProducto,
  updateProducto,
} from "../controller/producto";
import { ValidateCreateProductoCompleto } from "../validation/producto";

const router = Router();

router.get("/", getProductos);
router.get("/:producto_id", getProducto);
router.get("/detalle/:producto_id", getDetalleProducto);
router.get("/talladetalle/:detalle_id", getTallaProducto);
router.get("/lose/:tienda_id", loseProducto);
router.get("/colores/:producto_id", getColoresProducto);
router.get("/tienda/:tienda_id", getProductosTienda);

router.post(
  "/create/detalle",
  // ValidateCreateProductoCompleto,
  createProductoCompleto
);
router.post("/create", createProducto);

// router.post("/detalle/create", createProductoDetalle);

router.put("/update/:producto_id", updateProducto);

router.delete("/delete/:producto_id", deleteProducto);

export { router };
