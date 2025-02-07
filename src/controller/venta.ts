import { Request, Response } from "express";
import {
  _activarVenta,
  _createVenta,
  _desactivarVenta,
  _getDatosCliente,
  _getVenta,
  _getVentas,
} from "../service/venta";
import { handleHttp } from "../util/error.handler";

export const createVenta = async (req: Request, res: Response) => {
  const {
    tipo,
    cantidad,
    total_b,
    total_igv,
    total_N,
    tipoPago,
    dni,
    ruc,
    direccion,
    nombre,
    detalle
  } = req.body;

  const venta: any = {
    tipo,
    cantidad,
    total_b,
    total_igv,
    total_N,
    tipoPago,
    dni,
    ruc,
    direccion,
    nombre,
    detalle
  };

  try {
    const response = await _createVenta(venta);
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_createVenta");
  }
};

export const getVentas = async (req: Request, res: Response) => {
  const tipoComprobante = req.query.tipoComprobante as string;

  try {
    const response = await _getVentas(Number(tipoComprobante));
    res
      .status(response.status)
      .json(response.items ? response.items : response);
  } catch (error) {
    handleHttp(res, "error_getVentas");
  }
};

export const getDatosCliente = async(req:Request,res:Response)=>{
  const {datos} = req.params;
  const tipo = req.query.tipo as string;
  try {
    const response = await _getDatosCliente(tipo,Number(datos))
    res
      .status(response.status)
      .json(response.items);
  } catch (error) {
    handleHttp(res, "error_getVentas");
  }
}

export const getVenta = async (req: Request, res: Response) => {
  const { venta_id } = req.params;
  try {
    const response = await _getVenta(Number(venta_id));
    res.status(response.status).json(response.item ? response.item : response);
    // res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_getVenta");
  }
};

export const desactivarVenta = async (req: Request, res: Response) => {
  const { venta_id } = req.params;

  try {
    const response = await _desactivarVenta(Number(venta_id));
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_desactivarVenta", 500);
  }
};

export const activarVenta = async (req: Request, res: Response) => {
  const { venta_id } = req.params;

  try {
    const response = await _activarVenta(Number(venta_id));
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_desactivarVenta", 500);
  }
};
