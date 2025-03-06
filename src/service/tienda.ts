import { query } from "../util/query";

// Función para crear una nueva tienda
export const _createTienda = async (tienda: any) => {
  const consulta = `
    INSERT INTO tienda (tienda, direccion, telefono, estado)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const result = await query(consulta, [
      tienda.tienda ?? null,
      tienda.direccion ?? null,
      tienda.telefono ?? null,
      tienda.estado ?? 1
    ]);
    return result;
  } catch (error) {
    console.error("Error al crear la tienda:", error);
    return {
      message: "Error al crear la tienda. Intente nuevamente más tarde.",
      success: false,
      status: 500,
    };
  }
};

// Función para obtener todas las tiendas
export const _getTiendas = async () => {
  try {
    const response = (await query(`CALL SP_GetTiendas()`)) as any;

    // Mapea los resultados de la tienda
    const tiendasData = response.data[0].map((tienda: any) => {
      return {
        ...tienda,
      };
    });

    return {
      items: tiendasData,
      success: true,
      status: 200,
    };
  } catch (error) {
    return {
      message: "error _getTiendas",
      success: false,
      status: 500,
    };
  }
};

// Función para obtener una tienda específica por su ID
export const _getTienda = async (tienda_id: number) => {
  try {
    const response = (await query(`CALL SP_GetTienda(?)`, [tienda_id])) as any;

    // Mapea los datos de la tienda
    const tiendaData = response.data[0].map((tienda: any) => {
      return {
        ...tienda,
      };
    });

    return {
      items: tiendaData[0],
      success: true,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "error _getTienda",
      success: false,
      status: 500,
    };
  }
};

// Función para desactivar una tienda
export const _desactivarTienda = async (tienda_id: number) => {
  const queryText =
    "UPDATE tienda SET estado = false WHERE tienda_id = ? AND estado != false;";

  try {
    const result = await query(queryText, [tienda_id]);
    console.log(result);

    // Verifica si se afectaron filas (tienda desactivada correctamente)
    if (result.success && result.affectedRows > 0) {
      return {
        message: `La tienda con ID ${tienda_id} ha sido desactivada correctamente.`,
        success: true,
        status: 200,
      };
    } else {
      return {
        message: `No se encontró una tienda con ID ${tienda_id} o ya estaba desactivada.`,
        success: false,
        status: 400,
      };
    }
  } catch (error: any) {
    console.error("Error al desactivar la tienda:", error);
    return {
      message: error.message || "Error desconocido al desactivar la tienda.",
      success: false,
      status: 500,
    };
  }
};

// Función para activar una tienda
export const _activarTienda = async (tienda_id: number) => {
  const queryText =
    "UPDATE tienda SET estado = true WHERE tienda_id = ? AND estado != true;";

  try {
    const result = await query(queryText, [tienda_id]);

    // Verifica si se afectaron filas (tienda activada correctamente)
    if (result.success && result.affectedRows > 0) {
      return {
        message: `La tienda con ID ${tienda_id} ha sido activada correctamente.`,
        success: true,
        status: 200,
      };
    } else {
      return {
        message: `No se encontró una tienda con ID ${tienda_id} o ya estaba activada.`,
        success: false,
        status: 400,
      };
    }
  } catch (error: any) {
    console.error("Error al activar la tienda:", error);
    return {
      message: error.message || "Error desconocido al desactivar la tienda.",
      success: false,
      status: 500,
    };
  }
};

// Función para actualizar una tienda
export const _updateTienda = async (tienda_id: number, tienda: any) => {
  const queryText =
    "UPDATE tienda SET tienda = ?, direccion = ?, telefono = ? WHERE tienda_id = ?";

  const { nombre, direccion, telefono } = tienda;

  try {
    const result = await query(queryText, [
      nombre,
      direccion,
      telefono,
      tienda_id,
    ]);

    // Verifica si se afectaron filas (tienda actualizada correctamente)
    if (result.success && result.affectedRows > 0) {
      return {
        message: `La tienda con ID ${tienda_id} ha sido actualizada`,
        success: true,
        status: 200,
      };
    } else {
      return {
        message: `No se encontró una tienda con ID ${tienda_id}`,
        success: false,
        status: 400,
      };
    }
  } catch (error: any) {
    console.error("Error al actualizar la tienda:", error);
    return {
      message: error.message || "Error desconocido al desactivar la tienda.",
      success: false,
      status: 500,
    };
  }
};

// Función para generar un reporte PDF de la tienda
export const _generarReporte = async (res: any, tienda_id: number) => {
  try {
    console.log("Iniciando generación del reporte...");

    const PDFDocument = require("pdfkit-table");

    // Configura las cabeceras para generar el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="reporte.pdf"');

    const dataTienda: any = await query(
      `CALL SP_GetReporteTienda(${tienda_id})`
    );
  // Procesa la información de los trabajadores
  const tiendaData = dataTienda.data[0]; // Acceder al primer objeto de la respuesta

  const trabajadoresInfo = tiendaData[0].trabajadores_info;
  let trabajadoresData;
  if (trabajadoresInfo) {
    trabajadoresData = trabajadoresInfo
      .split("),") // Separar por cada trabajador
      .map((item : string) => {
        // Limpiar cada entrada y convertirla en un objeto
        const datos = item.replace(/[()]/g, "").split(","); // Eliminar paréntesis y dividir por coma
        return {
          id: datos[0],
          nombre: `${datos[1]} ${datos[2]} ${datos[3]}`, // Concatenar nombre completo
          telefono: datos[4],
          dni: datos[5],
          sueldo: datos[6],
        };
      });

    }
    console.log("Trabajadores parseados:", trabajadoresData);

    const productosInfo = tiendaData[0].productos_info;
    let productosData;
    // Procesa la información de los productos
  if (productosInfo) {

    productosData = trabajadoresInfo
            .split("),(")
            .map((item: string) => {
              const [nombre_producto, color, lote, stock, talla, cantidad] =
                item.replace(/\(|\)/g, "").trim().split(",");
              return {
                nombre_producto: nombre_producto,
                color: color,
                lote: lote,
                stock: stock,
                talla: talla,
                cantidad: cantidad,
              };
            })
            .reduce((acc: any, producto: any) => {
              const { nombre_producto, ...detalle } = producto;
              const existente = acc.find(
                (item: any) => item.nombre_producto === nombre_producto
              );
              if (existente) {
                existente.detalle.push(detalle);
              } else {
                acc.push({ nombre_producto, detalle: [detalle] });
              }
              return acc;
            }, [])
    }

    console.log("Productos parseados:", productosData);

    // Crea el documento PDF
    const doc = new PDFDocument({
      bufferPages: true,
      title: "Reporte Tienda",
      permissions: {
        printing: "highResolution",
      },
      size: "A4",
      layout: "portrait",
    });

    doc.pipe(res);

    // Agrega la imagen y el título
    doc.image("src/Img/logo.png", 60, 10, {
      fit: [100, 100],
      align: "center",
      valign: "center",
    });

    doc.fontSize(20).text("KALIFFO SAC", 250, 50);
    doc.font("Helvetica-Bold").fontSize(18).text("REPORTE DE TIENDA", 230, 75);

    // Configura la tabla de datos de la tienda
    console.log("Configura la tabla de datos de la tienda")
    const tablaDatosTienda = {
      title: `Datos de ${dataTienda.data[0][0].tienda}`,
      headers: [
        {
          label: "Nombre",
          property: "tienda",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "Direccion",
          property: "direccion",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "Telefono",
          property: "telefono",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "Stock Total",
          property: "total_stock",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "Trabajadores Totales",
          property: "trabajadores",
          headerAlign: "center",
          align: "center",
        },
      ],
      datas: [
        {
          tienda: dataTienda.data[0][0].tienda,
          direccion: dataTienda.data[0][0].direccion,
          telefono: dataTienda.data[0][0].telefono,
          total_stock: dataTienda.data[0][0].total_stock
            ? dataTienda.data[0][0].total_stock
            : 0,
            trabajadores: dataTienda.data[0][0].trabajadores
            ? dataTienda.data[0][0].trabajadores
            : 0,
        },
      ],
    };

    // Agregar un log de las cabeceras para ver si no están nulas
    console.log("Cabeceras de Datos de la tienda:", tablaDatosTienda.headers);
    console.log("Data de Datos de la tienda:", tablaDatosTienda.datas);

    // Configura la tabla de datos de los trabajadores
    const tablaDatosTrabajadores = {
      title: "TRABAJADORES",
      headers: [
        {
          label: "Nombre",
          property: "nombre_completo",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "Telefono",
          property: "telefono",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "DNI",
          property: "dni",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "Sueldo",
          property: "sueldo",
          headerAlign: "center",
          align: "center",
        },
      ],
      datas: trabajadoresData.map((trabajador: any) => {
        return {
          nombre_completo: trabajador.nombre,
          telefono: trabajador.telefono,
          dni: trabajador.dni,
          sueldo: trabajador.sueldo,
        };
      }),
    };

    // Agregar un log de las cabeceras de trabajadores
    console.log("Cabeceras de Trabajadores:", tablaDatosTrabajadores.headers);

    //CORRECTO
    if (!trabajadoresData || productosData ) {
      console.log("No se encontraron trabajadores para esta tienda.");
      return res.status(404).send("No se encontraron trabajadores.");
    }

    // Función para agregar tablas dinámicamente
    const nuevaTabla = async (tablaData: any, posY: number) => {
      console.log("Agregando tabla..." + posY);
      console.log(tablaData);
      const tablaAltura = await doc.table(tablaData, {
        width: 500,
        x: 55,
        y: posY,
        prepareRow: (
          row: string[],
          indexColumn: number,
          indexRow: number,
          rectRow: { x: number; y: number; width: number; height: number },
          rectCell: { x: number; y: number; width: number; height: number }
        ) => {
          const { x, y, width, height } = rectCell;
          if (indexColumn === 0) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y)
              .lineTo(x, y + height)
              .stroke();
          }
          doc
            .lineWidth(0.5)
            .moveTo(x + width, y)
            .lineTo(x + width, y + height)
            .stroke();
        },
      });

      if (tablaAltura + posY > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }
      
      console.log("Nueva Y:", tablaAltura + posY);
      return posY + tablaAltura;
    };

    let posY = 120;

    // Agrega la tabla de datos de la tienda
    posY = await nuevaTabla(tablaDatosTienda, posY);
    // Agrega la tabla de trabajadores
    posY = await nuevaTabla(tablaDatosTrabajadores, posY);

    console.log("Productos Data:", productosData);
    if (productosData == undefined) {
      return doc.end();
    }
    // Agrega las tablas de productos
    for (const producto of productosData) {
      const tablaDatosProducto = {
        title: `${producto.nombre_producto}`,
        headers: [
          {
            label: "Color",
            property: "color",
            headerAlign: "center",
            align: "center",
          },
          {
            label: "Lote",
            property: "lote",
            headerAlign: "center",
            align: "center",
          },
          {
            label: "Stock",
            property: "stock",
            headerAlign: "center",
            align: "center",
          },
          {
            label: "Talla",
            property: "talla",
            headerAlign: "center",
            align: "center",
          },
          {
            label: "Cantidad",
            property: "cantidad",
            headerAlign: "center",
            align: "center",
          },
        ],
        datas: producto.detalle,
      };

      posY = await nuevaTabla(tablaDatosProducto, posY);
    }

    doc.end();
  } catch (error : any) {
    console.error("Error al generar el reporte:", error);
    throw new Error("Error al generar el reporte: " + error.message);
  }
};
