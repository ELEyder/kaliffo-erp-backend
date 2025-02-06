import { Router } from "express";
import {
  createTela,
  desactivarTela,
  getTelaPorTipo,
  getTelas,
  getTelasID,
  getTipos,
  imprimirCodigos,
  updateTela,
} from "../controller/telas";
import { validateToken } from "../middleware/validateToken";

const multer = require('multer');

const upload = multer({dest:"uploads/"});

const router = Router();

// Middleware de validación para asegurarse que solo los usuarios con el rol 'administrador' puedan acceder a estas rutas
const Validate = validateToken(["administrador"]);
router.use(Validate);

// Rutas revisadas

// Obtener los tipos de telas disponibles
router.get("/tipo", getTipos);

//obtener pdf con codigos de barras
router.get("/imprimir/:lote_id",imprimirCodigos)

//obtener telas por id 
router.get("/codigos/:tela_id",getTelasID)

// Obtener todas las telas
router.get("", getTelas);

// Rutas sin revisar

// Crear una nueva tela
router.post("/create", upload.single("file"), createTela);

// Actualizar los detalles de una tela existente usando su 'tela_id'
router.put("/update/:tela_id", updateTela);

// Desactivar una tela específica utilizando su 'tela_id'
router.put("/desactivar/:tela_id", desactivarTela);

// Obtener las telas de un tipo específico
router.get("/:tipo_tela", getTelaPorTipo);

export { router };
