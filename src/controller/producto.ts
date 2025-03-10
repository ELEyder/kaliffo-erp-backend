import { Request, response, Response } from "express";
// import { Producto } from "../interface/producto";
import {
  _activarProducto,
  _createProducto,
  _createProductoCompleto,
  _desactivarProducto,
  _getColoresProducto,
  _getDetalleProducto,
  _getProducto,
  _getProductoCompletoCodigo,
  _getProductos,
  _getProductosAlmacen,
  _getProductoSimpleCodigo,
  _getProductosTienda,
  _getTallaProducto,
  _imprimirCodigo,
  _loseProductos,
  _updateProducto,
} from "../service/producto";
import { handleHttp } from "../util/error.handler";

export const createProducto = async (req: Request, res: Response) => {
  const { nombre, stockTotal = 0, precioBase, descuento, estado = 1 } = req.body;
  try {
    const response = await _createProducto({
      nombre,
      stockTotal,
      precioBase,
      descuento,
      estado
    });
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_createProducto", 500);
  }
};

// export const createProductoCompleto = async (req: Request, res: Response) => {
//   const tienda_id = req.query.tienda_id as string;
//   const almacen_id = req.query.almacen_id as string;
//   const { producto_id, lote_id, detalles } = req.body;

//   try {
//     const response = await _createProductoCompleto(
//       tienda_id,
//       almacen_id,
//       producto_id,
//       detalles,
//       lote_id
//     );
//     res.status(response.status).json(response);
//   } catch (error) {
//     handleHttp(res, "error_createProductoCompleto", 500);
//   }
// };

export const getProductos = async (req: Request, res: Response) => {
  const tienda_id = req.query.tienda_id;
  const almacen_id = req.query.almacen_id;
  const loose_id = req.query.loose_id;
  try {
    let response;

    if (tienda_id) {
      response = await _getProductosTienda(Number(tienda_id));
    } else if (loose_id) {
      response = await _loseProductos(Number(loose_id));
    } else if (almacen_id){
      response = await _getProductosAlmacen(Number(almacen_id))
    }else {
      response = await _getProductos();
      console.log("NO HAY PARAM");
    }

    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error_getProductos", 500);
  }
};

export const getProducto = async (req: Request, res: Response) => {
  const { producto_id } = req.params;

  try {
    const response = await _getProducto(Number(producto_id));
    res.status(response.status).json(response.item);
  } catch (error) {
    handleHttp(res, "error_getProducto", 500);
  }
};

export const updateProducto = async (req: Request, res: Response) => {
  const { producto_id } = req.params;
  const { nombre, precioBase, descuento } = req.body;

  try {
    const response = await _updateProducto({
      producto_id,
      nombre,
      precioBase,
      descuento,
    });
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_updateProducto", 500);
  }
};

export const getColoresProducto = async (req: Request, res: Response) => {
  const { producto_id } = req.params;

  try {
    const response = await _getColoresProducto(Number(producto_id));
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error ", 500);
  }
};

export const getDetalleProducto = async (req: Request, res: Response) => {
  const { producto_id } = req.params;
  const tienda_id = req.query.tienda_id;
  const almacen_id = req.query.almacen_id;
  const talla = req.query.talla as string;
  const tipo = req.query.tipo as string;

  try {
    const response = await _getDetalleProducto(
      Number(producto_id),
      Number(tienda_id),
      Number(almacen_id),
      talla,
      tipo
    );
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error ", 500);
  }
};

export const getTallaProducto = async (req: Request, res: Response) => {
  const { detalle_id } = req.params;

  try {
    const response = await _getTallaProducto(Number(detalle_id));
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error ", 500);
  }
};

export const desactivarProducto = async (req: Request, res: Response) => {
  const { producto_id } = req.params;

  try {
    const response = await _desactivarProducto(Number(producto_id));
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_desactivarProducto", 500);
  }
};

export const activarProducto = async (req: Request, res: Response) => {
  const { producto_id } = req.params;

  try {
    const response = await _activarProducto(Number(producto_id));
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_desactivarProducto", 500);
  }
};

export const Imprimir = async (req: Request, res: Response) => {
  const {lote_id} = req.params;
  try {
    const response = await _imprimirCodigo(res,lote_id);
  } catch (error) {
    console.log(error);
    handleHttp(res, "error_desactivarProducto", 500);
  }
};

export const getProductoSimpleCodigo = async(req:Request,res:Response)=>{
  const {codigo} = req.params;
  const tienda_id = req.query.tienda_id;
  const almacen_id = req.query.almacen_id;

  try {
    const response = await _getProductoSimpleCodigo(
      codigo,
      (tienda_id?"tienda_id":"almacen_id"),
      (tienda_id?Number(tienda_id):Number(almacen_id))
    );
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error ", 500);
  }
}

export const getProductoCompletoCodigo = async(req:Request,res:Response)=>{
  const {codigo} = req.params;

  try {
    const response = await _getProductoCompletoCodigo(
      codigo
    );
    res.status(response.status).json(response.items);
  } catch (error) {
    handleHttp(res, "error ", 500);
  }
}


