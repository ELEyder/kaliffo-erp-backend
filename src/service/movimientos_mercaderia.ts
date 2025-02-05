import { query } from "../util/query";

// Función para obtener los movimientos de mercadería en función del ID de la tienda
export const _getmovimientos_mercaderia = async (tienda_id: number) => {
  try {
    let queryS: string;
    let params: Array<number> = []; // Inicializa el array de parámetros

    // Si se proporciona un ID de tienda, buscamos los movimientos donde la tienda es origen o destino
    if (tienda_id) {
      queryS = `
        SELECT * FROM movimientomercaderia
        WHERE movimientomercaderia.tienda_idI = ? 
        OR movimientomercaderia.tienda_idF = ?;
      `;
      params = [tienda_id, tienda_id];
    } else {
      // Si no se proporciona un ID de tienda, obtenemos todos los movimientos
      queryS = `
        SELECT * FROM movimientomercaderia;
      `;
    }

    // Imprime la consulta para depuración
    console.log(queryS);

    // Ejecutar la consulta y retornar los datos
    const data = await query(queryS, params);
    return {
      items: data.data,
      success: true,
      status: 200,
    };
  } catch (error) {
    return {
      message: "ERROR AL OBTENER MOVIMIENTOS",
      success: false,
      status: 500,
    };
  }
};

// Función para crear un nuevo movimiento de mercadería
export const _createmovimientos_mercaderia = async (movimiento: any) => {
  try {
    // Consulta para verificar si el producto existe en la tienda de destino
    const Queryvalidar =
      "SELECT productoDetalle.productoDetalle_id FROM productoDetalle WHERE producto_id = ? AND tienda_id = ?";

    // Ejecuta la consulta de validación
    const tiendaResult = (await query(Queryvalidar, [
      movimiento.producto_id,
      movimiento.tienda_idD,
    ])) as any;

    // Imprime el resultado de la consulta para depuración
    console.log(tiendaResult.data[0]);

    // Si el producto existe en la tienda destino
    if (tiendaResult.data.length > 0) {
      console.log("SI HAY "); // Producto encontrado
    } else {
      console.log("NO HAY WEY"); // Producto no encontrado
    }

    return {
      items: "HOLA", // Se debe reemplazar con los datos reales que se desean retornar
      success: true,
      status: 200,
    };
  } catch (error) {
    return {
      message: "ERROR AL OBTENER MOVIMIENTOS",
      success: false,
      status: 500,
    };
  }
};

// Función para crear un nuevo movimiento de mercadería
export const _createmovimientos_mercaderiaAT = async (movimiento:any) => {
  try {
    // Obtener el último código de movimiento
    const { data: lastMovements } = await query(
      `SELECT codigo FROM movimientos_almacen_tienda ORDER BY codigo DESC LIMIT 1`
    );

    // Generar nuevo código
    const codigo = lastMovements.length
      ? `ENV-${(parseInt(lastMovements[0].codigo.split("-")[1]) + 1).toString().padStart(2, "0")}`
      : "ENV-01";

    // Fecha actual en formato YYYY-MM-DD
    const fechaHoy = new Date().toISOString().slice(0, 10);

    // Insertar cabecera del movimiento
    const { insertId: movimientoId } = await query(
      `INSERT INTO movimientos_almacen_tienda (codigo, almacen_origen, tienda_destino, transporte, fecha_envio, fecha_inicio_envio)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo, movimiento.almacen_id, movimiento.tienda_id, "particular", fechaHoy, fechaHoy]
    );

    if (!movimientoId) throw new Error("No se pudo crear el movimiento");

    // Procesar detalles del movimiento
    for (const detalle of Object.values(movimiento.detalle)as any) {
      const { data: productoExistente } = await query(
        `SELECT productoDetalle_id FROM productodetalle WHERE tienda_id = ? AND producto_id = ? AND color_id = ? LIMIT 1`,
        [movimiento.tienda_id, detalle.producto_id,detalle.color_id]
      );

      const productoDetalleId = productoExistente.length
        ? productoExistente[0].productoDetalle_id
        : (await query(
            `INSERT INTO productodetalle (producto_id, color_id, lote_id, tienda_id, stock)
             VALUES (?, ?, ?, ?, ?)`,
            [detalle.producto_id, detalle.color_id, 1, movimiento.tienda_id, detalle.cantidad]
          )).insertId;
          

      for (const d of detalle.detalles) {
        await query(
          `UPDATE productodetalle SET stock = stock - ? WHERE productoDetalle_id=?`,
          [d.cantidad,d.detalle_id]
        );
        
        await query(
          `UPDATE productotalla SET productoDetalle_id = ? WHERE productoDetalle_id=? LIMIT ?`,
          [productoDetalleId, d.detalle_id,d.cantidad]
        );
      }

      // Insertar detalle del movimiento
      await query(
        `INSERT INTO movimientos_almacen_tienda_detalle (movimiento_id, producto_id, color_id, talla, cantidad)
         VALUES (?, ?, ?, ?, ?)`,
        [movimientoId, detalle.producto_id, detalle.color_id, detalle.talla, detalle.cantidad]
      );
    }

    return { items: "Movimiento creado exitosamente", success: true, status: 200 };
  } catch (error) {
    console.error("Error al crear movimiento de mercadería:", error);
    return { message: "ERROR AL CREAR MOVIMIENTO", success: false, status: 500 };
  }
};
