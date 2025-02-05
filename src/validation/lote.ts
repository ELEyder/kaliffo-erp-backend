import { check } from "express-validator";
import { validateResult } from "../util/validation";
import { NextFunction, Request, Response } from "express";

export const ValidateCreateLote: any = [
  check("rollos_tela")
    .exists()
    .withMessage("EL campo 'rollos_tela' es obligatorio.")
    .not()
    .isEmpty()
    .withMessage("El campo 'rollos_tela' no debe ser vacio."),
  check("productos")
    .exists()
    .withMessage("EL campo 'productos' es obligatorio.")
    .not()
    .isEmpty()
    .withMessage("El campo 'productos' no debe ser vacio."),
  check("metraje")
    .exists()
    .withMessage("EL campo 'metraje' es obligatorio.")
    .not()
    .isEmpty()
    .withMessage("El campo 'metraje' no debe ser vacio.")
    .isFloat({ min: 0.1 })
    .withMessage("El campo 'metraje' debe ser un número decimal positivo."),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];
