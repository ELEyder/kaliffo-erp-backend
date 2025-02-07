import { query } from "../util/query";

// Función para crear una venta
export const _createVenta = async (venta: any) => {
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
    detalle,
  } = venta;

  try {
    if (cantidad > 10 && dni) {
      return {
        message: "Debe ser Factura no boleta.",
        success: false,
        status: 400, // Estado 400 indica que la solicitud tiene un error
      };
    }
    // Verifica si el código de venta ya existe en la base de datos
    const { data: Codigo } = await query(
      `SELECT codigo FROM venta ORDER BY codigo DESC LIMIT 1`
    );

    const codigo = Codigo.length
      ? `V${tipo === "boleta" ? "B" : "F"}-${(
          parseInt(Codigo[0].codigo.split("-")[1]) + 1
        )
          .toString()
          .padStart(2, "0")}`
      : `V${tipo === "boleta" ? "B" : "F"}-01`;

    // Fecha actual en formato YYYY-MM-DD
    const fechaHoy = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Consulta SQL para insertar la venta en la base de datos
    const queryTextVenta = `
    INSERT INTO venta 
    (codigo, tipoVenta, tipoComprobante, fecha, cantidad_total, totalBruto, totalIgv, totalNeto, tipoPago, dni, ruc, direccion, nombre, tienda_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    // Ejecuta la inserción de la venta
    const { insertId: venta_id } = await query(queryTextVenta, [
      codigo,
      cantidad < 5 ? 1 : 2,
      tipo === "boleta" ? 1 : 2,
      fechaHoy,
      cantidad,
      total_b,
      total_igv,
      total_N,
      tipoPago,
      dni || null,
      ruc || null,
      direccion || null,
      nombre,
      null,
    ]);

    // Llama a la función para crear los detalles de la venta
    const detallesResult = await _createDetalleVenta(venta_id, detalle);

    if (!detallesResult.success) {
      return {
        message: "Venta creada, pero algunos detalles tuvieron errores.",
        success: false,
        errors: detallesResult.errors,
        status: 400, // Estado 400 indica que hubo un error en algunos detalles
      };
    }

    return {
      message: "Venta y detalles creados con éxito.",
      success: true,
      status: 201, // Estado 201 indica que la creación fue exitosa
    };
  } catch (error) {
    console.error("Error al crear la venta o detalles:", error);
    return {
      message: "Error al crear la venta o detalles",
      success: false,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};

// Función para crear los detalles de una venta
export const _createDetalleVenta = async (
  venta_id: number,
  detallesVenta: any[]
) => {
  let errors: any[] = []; // Array para almacenar los errores de los detalles
  // Itera sobre cada detalle de la venta y lo inserta en la base de datos
  for (const detalle of Object.values(detallesVenta) as any) {
    try {
      for (const d of detalle.detalles) {
        await query(
          `UPDATE productodetalle SET stock = stock - ? WHERE productoDetalle_id=?`,
          [d.cantidad, d.detalle_id]
        );
        await query(
          `DELETE FROM productotalla where productoDetalle_id = ? AND CODIGO=? LIMIT ?`,
          [d.detalle_id, d.codigo, d.cantidad]
        );
      
        // Insertar detalle de la venta
        await query(
          `INSERT INTO detalleventa (venta_id, productoDetalle_id, codigo, cantidad, precioUnitario)
         VALUES (?, ?, ?, ?, ?)`,
          [
            venta_id,
            d.detalle_id,
            d.codigo,
            detalle.cantidad,
            detalle.precio
          ]
        );
      }
    } catch (error: any) {
      console.error("Error al crear detalle de venta:", error);
      errors.push({
        productoDetalle_id: detalle.productoDetalle_id,
        message: error.message,
      }); // Guarda los errores para cada detalle que no se pudo insertar
    }
  }

  if (errors.length > 0) {
    return {
      message: "Se encontraron errores al crear algunos detalles de la venta.",
      errors,
      success: false,
      status: 400, // Estado 400 indica errores en los detalles
    };
  }

  return {
    message: "Detalles de venta creados con éxito.",
    success: true,
    status: 201, // Estado 201 indica que los detalles fueron creados exitosamente
  };
};

// Función para obtener todas las ventas, opcionalmente filtradas por tipo de comprobante
export const _getVentas = async (tipoComprobante?: number) => {
  try {
    let queryVentas = `
      SELECT 
      *
      from venta 
    `;

    // Filtra por tipo de comprobante si se proporciona
    if (tipoComprobante) {
      queryVentas += ` WHERE venta.tipoComprobante = ?`;
    }

    queryVentas += `
      GROUP BY venta.venta_id;
    `;

    const resultVentas = tipoComprobante
      ? await query(queryVentas, [tipoComprobante])
      : await query(queryVentas);

    return {
      items: resultVentas.data, // Retorna todas las ventas obtenidas
      success: true,
      status: 200, // Estado 200 indica que la recuperación fue exitosa
    };
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return {
      message: "Error al obtener las ventas",
      success: false,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};

export const _getDatosCliente = async (tipo: string, datos: number) => {
  try {
    const response = await fetch(`https://buscaruc.com/api/v1/${tipo}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token:
          "eyJ1c2VySWQiOjUwNzUsInVzZXJUb2tlbklkIjo1MDc1fQ.CMFZYJKPHyA3Bneg_ot8OuXFf-QqkKt-Zn5W7-OjV-mWK0RfIkDtnAcs93XnmNhqNx6B_9kb6tPlDnirkeI7H84RU20ZehVpjUNDqWJJoxWR3SrX4bvi7K27EdQaoUiYfDC-cWEO_NeIeUhmsPC7F0OMOWB2AXaA0F1__QShacM", // Asegúrate de que el token esté en tus variables de entorno
        [tipo]: datos.toString(), // Esto será { ruc: "10178520739" } o { dni: "12345678" }
      }),
    });

    const data = await response.json();
    return {
      items: data.result, // Retorna todas las ventas obtenidas
      success: true,
      status: 200, // Estado 200 indica que la recuperación fue exitosa
    };
  } catch (error) {
    return {
      message: "Error al obtener datos",
      success: false,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};

// Función para obtener una venta específica por su ID
export const _getVenta = async (venta_id: number) => {
  try {
    const queryVenta = `
      SELECT * FROM venta WHERE venta_id = ? 
    `;
    const resultVenta = (await query(queryVenta, [venta_id])) as any;

    if (resultVenta.length === 0) {
      return {
        message: "Venta no encontrada",
        success: false,
        status: 404, // Estado 404 indica que la venta no fue encontrada
      };
    }

    const venta = resultVenta.data[0];

    // Consulta los detalles de la venta
    const queryDetalles = `
      SELECT 
        CONCAT(p.nombre, ' ', c.nombre) AS nombre,
          dv.codigo,
          dv.cantidad,
          dv.precioUnitario,
          (dv.cantidad*dv.precioUnitario) as precioNeto
      FROM 
          detalleVenta dv
      INNER JOIN 
          productodetalle pd ON dv.productoDetalle_id = pd.productoDetalle_id
      INNER JOIN 
          producto p ON p.producto_id = pd.producto_id
      INNER JOIN 
          color c ON pd.color_id = c.color_id
      WHERE 
          dv.venta_id = ?;
    `;
    const resultDetalles = await query(queryDetalles, [venta_id]);

    venta.detalles = resultDetalles.data; // Agrega los detalles a la venta

    return {
      item: resultVenta.data[0], // Retorna la venta con sus detalles
      success: true,
      status: 200, // Estado 200 indica éxito en la recuperación
    };
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return {
      message: "Error al obtener la venta",
      success: false,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};

// Función para desactivar una venta (establecer su estado a 0)
export const _desactivarVenta = async (venta_id: number) => {
  const queryText =
    "UPDATE venta SET estado = 0 WHERE venta_id = ? AND estado != 0;"; // Consulta SQL para desactivar la venta

  try {
    const result = await query(queryText, [venta_id]);

    if (result.success && result.affectedRows > 0) {
      return {
        message: `La venta con ID ${venta_id} ha sido desactivada correctamente.`,
        success: true,
        status: 200, // Estado 200 indica que la venta fue desactivada exitosamente
      };
    } else {
      return {
        message: `No se encontró venta con ID ${venta_id} o ya estaba desactivada.`,
        success: false,
        status: 400, // Estado 400 indica que no se pudo desactivar la venta
      };
    }
  } catch (error: any) {
    console.error("Error al desactivar la venta:", error);
    return {
      message: error.message || "Error desconocido al desactivar venta.",
      success: false,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};

// Función para activar una venta (establecer su estado a true)
export const _activarVenta = async (venta_id: number) => {
  const queryText =
    "UPDATE venta SET estado = true WHERE venta_id = ? AND estado != true;"; // Consulta SQL para activar la venta

  try {
    const result = await query(queryText, [venta_id]);

    if (result.success && result.affectedRows > 0) {
      return {
        message: `La venta con ID ${venta_id} ha sido activada correctamente.`,
        success: true,
        status: 200, // Estado 200 indica que la venta fue activada exitosamente
      };
    } else {
      return {
        message: `No se encontró venta con ID ${venta_id} o ya estaba activada.`,
        success: false,
        status: 400, // Estado 400 indica que no se pudo activar la venta
      };
    }
  } catch (error: any) {
    console.error("Error al activar venta:", error);
    return {
      message: error.message || "Error desconocido al activar venta.",
      success: false,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};
