import { Request, Response } from "express";
import { handleHttp } from "../util/error.handler";
import { _createmovimientos_mercaderia, _createmovimientos_mercaderiaAT, _getMovimientoDetalle, _getmovimientos_mercaderia, _getmovimientos_mercaderia_tipo } from "../service/movimientos_mercaderia";

export const getmovimientos_mercaderia = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await _getmovimientos_mercaderia();
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error_getUsuario", 500);
  }
};

export const getmovimientos_mercaderia_tipo = async (
  req: Request,
  res: Response
) => {
  const {tipo} = req.params
  try {
    const response = await _getmovimientos_mercaderia_tipo(tipo);
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error_getUsuario", 500);
  }
};

export const getMovimientoDetalle = async(
  req:Request,
  res:Response
)=>{
  const {movimiento_id} = req.params
  const tipo = req.query.tipo as string;
  try {
    const response = await _getMovimientoDetalle(Number(movimiento_id), tipo);
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error_getUsuario", 500);
  }
}

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
