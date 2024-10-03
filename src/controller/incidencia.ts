import { Request, Response } from "express";
import {
  _createIncidencia,
  _deleteIncidencia,
  _getIncidencia,
  _getIncidencias,
  _updateIncidencia,
} from "../service/incidencia";
import { handleHttp } from "../util/error.handler";

export const createIncidencia = async (req: Request, res: Response) => {
  const { usuario_id, tipo, descripcion } = req.body;

  try {
    const response = await _createIncidencia({ usuario_id, tipo, descripcion });
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_createIncidencia", 500);
  }
};

export const getIncidencias = async (req: Request, res: Response) => {
  const usuario_id = req.query.usuario_id as string;

  try {
    const response = await _getIncidencias(Number(usuario_id));
    res
      .status(response.status)
      .json(response.items);
  } catch (error) {
    handleHttp(res, "error_getIncidencias", 500);
  }
};

export const getIncidencia = async (req: Request, res: Response) => {
  const { incidencia_id } = req.params;

  try {
    const response = await _getIncidencia(Number(incidencia_id));
    res.status(response.status).json(response.item ? response.item : response);
  } catch (error) {
    handleHttp(res, "error_getIncidencia", 500);
  }
};

export const deleteIncidencia = async (req: Request, res: Response) => {
  const { incidencia_id } = req.params;
  try {
    const response = await _deleteIncidencia(Number(incidencia_id));
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_deleteIncidencia", 500);
  }
};

export const updateIncidencia = async (req: Request, res: Response) => {
  const { incidencia_id } = req.params;
  const { tipo, descripcion } = req.body;

  try {
    const response = await _updateIncidencia(Number(incidencia_id), {
      tipo,
      descripcion
    });
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_updateIncidencia", 500);
  }
};
