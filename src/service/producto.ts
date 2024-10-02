import { query } from "../util/query";

export const _createProducto = async (producto: any) => {
  const { nombre, stockTotal, precioBase, descuento } = producto;

  const queryText = `
        INSERT INTO producto (nombre, stockTotal, precioBase, descuento)
        VALUES (?, ?, ?, ?)`;

  const result = await query(queryText, [
    nombre,
    stockTotal,
    precioBase,
    descuento,
  ]);

  if (!result.success) {
    console.error("Error al crear el producto:", result.error);
    return {
      message: "Error al crear el producto. Intente nuevamente más tarde.",
      success: false,
      status: result.status || 500,
    };
  }

  return {
    message: "Producto creado con éxito.",
    success: true,
    status: 201,
  };
};

export const _getProductos = async () => {
  const queryText = `SELECT * FROM producto`;

  const result = await query(queryText);

  if (!result.success) {
    return {
      message: result.error,
      success: false,
      status: result.status || 500,
    };
  }

  return {
    items: result.data,
    success: true,
    status: 200,
  };
};

export const _getProducto = async (producto_id: number) => {
  const queryText = `SELECT * FROM producto WHERE producto_id = ?`;

  const result = await query(queryText, [producto_id]);

  if (!result.success) {
    return {
      message: result.error,
      success: false,
      status: result.status || 404,
    };
  }

  return {
    item: result.data,
    success: true,
    status: 200,
  };
};

export const _getProductosTienda = async (tienda_id: number) => {

  const result = await query(`CALL SP_GetProductosTienda(?)`, [tienda_id]);

  const TiendaProductosData = result.data[0].map((producto: any) => {
    return {
      ...producto,
    };
  });
  
  return {
    items: TiendaProductosData,
    success: true,
    status: 200,
  };
};

export const _updateProducto = async (producto: any) => {
  const { producto_id, nombre, stockTotal, precioBase, descuento } = producto;

  const queryText = `
        UPDATE producto 
        SET nombre = ?, stockTotal = ?, precioBase = ?, descuento = ?
        WHERE producto_id = ?`;

  const result = await query(queryText, [
    nombre,
    stockTotal,
    precioBase,
    descuento,
    producto_id,
  ]);

  if (!result.success) {
    console.error("Error al actualizar el producto:", result.error);
    return {
      message: "Error al actualizar el producto. Intente nuevamente más tarde.",
      success: false,
      status: result.status || 500,
    };
  }

  return {
    message: "Producto actualizado con éxito.",
    success: true,
    status: 200,
  };
};

export const _deleteProducto = async (producto_id: number) => {
  const queryText = `DELETE FROM producto WHERE producto_id = ?`;

  const result = await query(queryText, [producto_id]);

  if (!result.success) {
    console.error("Error al borrar el producto:", result.error);
    return {
      message: "Error al borrar el producto. Intente nuevamente más tarde.",
      success: false,
      status: result.status || 500,
    };
  }

  return {
    message: "Producto borrado con éxito.",
    success: true,
    status: 200,
  };
};

export const _loseProductos = async (tienda_id: string) => {
  try {
    const consulta = (await query(
      `
      SELECT DISTINCT p.producto_id, p.nombre
      FROM productoTienda pt
      INNER JOIN productoDetalle pd ON pd.productoDetalle_id = pt.productoDetalle_id
      INNER JOIN producto p ON p.producto_id = pd.producto_id
      LEFT JOIN (
          SELECT p2.producto_id
          FROM productoTienda pt2
          INNER JOIN productoDetalle pd2 ON pd2.productoDetalle_id = pt2.productoDetalle_id
          INNER JOIN producto p2 ON p2.producto_id = pd2.producto_id
          WHERE pt2.tienda_id = ?
      ) AS excluidos ON excluidos.producto_id = p.producto_id
      WHERE pt.tienda_id != ? AND excluidos.producto_id IS NULL
      GROUP BY p.producto_id;
    `,
      [tienda_id, tienda_id]
    )) as any;

    return {
      items: consulta[0],
      success: true,
      status: 202,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "_loseProductos",
      success: false,
      status: 404,
    };
  }
};

export const _getColoresProducto = async (producto_id: number) => {
  try {
    const [data] = (await query(`CALL SP_ColoresProductos(?);`, [
      producto_id,
    ])) as any;

    return {
      data,
      success: true,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      message: error,
      success: false,
      status: 500,
    };
  }
};
