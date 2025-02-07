import { query } from "../util/query";

// Función para obtener los movimientos de mercadería en función del ID de la tienda
export const _getmovimientos_mercaderia = async () => {
  try {
    

    const cantidad_almacen_tienda =await query("select count(*) as cantidad from movimientos_almacen_tienda;", []); ;

    const cantidad_movimientos_tienda_tienda= await query("select count(*) as cantidad from movimientos_tienda_tienda;",[]);

    const result  = {
      AT : cantidad_almacen_tienda.data[0].cantidad,
      TT : cantidad_movimientos_tienda_tienda.data[0].cantidad
    }

    return {
      items: result,
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

// Función para obtener los movimientos de mercadería en función del ID de la tienda
export const _getmovimientos_mercaderia_tipo = async (tipo:string) => {
  try {

    let queryS:any ;

    if(tipo==="AT"){
      queryS=`
      SELECT 
        mat.movimiento_id,
        mat.codigo,
        ap.nombre_almacen,
        t.tienda,
        mat.transporte,
        DATE_FORMAT(mat.fecha_envio,'%d-%m-%Y') as fecha_envio,
        DATE_FORMAT(mat.fecha_inicio_envio,'%d-%m-%Y') as fecha_inicio_envio
    FROM 
        movimientos_almacen_tienda AS mat
    INNER JOIN 
        almacen_producto AS ap ON mat.almacen_origen = ap.almacen_id
    INNER JOIN 
        tienda AS t ON mat.tienda_destino = t.tienda_id
    WHERE 
        mat.estado = 1
    ORDER BY 
        mat.fecha_envio DESC;
      `
    }else if (tipo==="TT"){
      console.log("AUN NO")
    }

    const result = await query(queryS)

    return {
      items: result.data,
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

export const _getMovimientoDetalle = async(movimiento_id:number,tipo:string)=>{
  let queryC:any,queryD:any;

  if(tipo==="AT"){
    queryC=`
      SELECT 
        mat.movimiento_id,
        mat.codigo,
        ap.nombre_almacen,
        t.tienda,
        mat.transporte,
        DATE_FORMAT(mat.fecha_envio,'%d-%m-%Y') as fecha_envio,
        DATE_FORMAT(mat.fecha_inicio_envio,'%d-%m-%Y') as fecha_inicio_envio
    FROM 
        movimientos_almacen_tienda AS mat
    INNER JOIN 
        almacen_producto AS ap ON mat.almacen_origen = ap.almacen_id
    INNER JOIN 
        tienda AS t ON mat.tienda_destino = t.tienda_id
    WHERE 
        mat.movimiento_id=?
    ORDER BY 
        mat.fecha_envio DESC;
      `

    queryD=`
      SELECT 
        p.nombre AS producto_nombre, 
        c.nombre AS color_nombre, 
        matd.cantidad
      FROM 
          movimientos_almacen_tienda_detalle AS matd
      INNER JOIN 
          producto AS p ON matd.producto_id = p.producto_id
      INNER JOIN 
          color AS c ON matd.color_id = c.color_id
      WHERE 
          matd.movimiento_id = ?
      ORDER BY 
          p.nombre; 
    `
  }

  try {

    const [cabeceraResult,detalleResult] = await Promise.all([
      query(queryC,[movimiento_id]),
      query(queryD,[movimiento_id])
    ])
    
    if (!cabeceraResult.success || !detalleResult.success) {
      return {
        message: cabeceraResult.error || detalleResult.error,
        success: false,
        status: cabeceraResult.status || detalleResult.status || 500,
      };
    }

    const movimientoDetallado = {
      cabecero:cabeceraResult.data[0],
      detalle:detalleResult.data
    }

    return{
      items:movimientoDetallado,
      success:true,
      status:200
    }
  } catch (error:any) {
    return {
      message: error.message,
      success: false,
      status: 500,
    };
  }

}


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

// Función para crear un nuevo movimiento de mercadería de un almacen a una tienda
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
