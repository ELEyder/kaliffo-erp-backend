import { Router } from "express";
import { _createAcabado } from "../service/talleres";
import {
  createAcabado,
  getAcabado,
  getAcabados,
  sgteEstadoAcabado,
} from "../controller/talleres";

const router = Router();

router.get("", getAcabados);
router.get("/:acabado_id", getAcabado);

router.put("/sgte/:acabado_id", sgteEstadoAcabado);

router.post("/create", createAcabado);

export { router };
