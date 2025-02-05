import { Request, Response } from "express";
import { handleHttp } from "../util/error.handler";
import { _createmovimientos_mercaderia, _createmovimientos_mercaderiaAT, _getmovimientos_mercaderia } from "../service/movimientos_mercaderia";

export const getmovimientos_mercaderia = async (
  req: Request,
  res: Response
) => {
  const tienda_id = req.query.tienda_id;
  try {
    const response = await _getmovimientos_mercaderia(Number(tienda_id));
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error_getUsuario", 500);
  }
};

export const createmovimientos_mercaderia = async (
  req: Request,
  res: Response
) => {
  const tipo = req.query.tipo;
  try {
    let response:any;
    if(tipo==="AT"){
      response = await _createmovimientos_mercaderiaAT(req.body);
    }else if (tipo==="TT"){
      response = await _createmovimientos_mercaderia(req.body);
    }
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error_getUsuario", 500);
  }
};
