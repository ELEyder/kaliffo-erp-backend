// import { Request, Response } from "express";
// // import { _deletePagos, _getPagos } from "../service/pago";
// import { handleHttp } from "../util/error.handler";

// export const getPagos = async (req: Request, res: Response) => {
//   const { usuario_id } = req.params;

//   try {
//     const response = await _getPagos(Number(usuario_id));
//     res.status(response.status);
//     // .json(response.items ? response.items : response);
//   } catch (error) {
//     handleHttp(res, "error_getPagos", 500);
//   }
// };

// export const deletePagos = async (req: Request, res: Response) => {
//   const { pago_id } = req.params;
//   try {
//     const response = await _deletePagos(Number(pago_id));
//     res.status(response.status).json(response);
//   } catch (error) {
//     handleHttp(res, "error_deletePagos", 500);
//   }
// };
