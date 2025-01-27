import { query } from "../util/query";

// Función para crear una nueva entrada de 'tela' en la base de datos
export const _createTela = async (tela: any) => {
  const {
    tipo,
    articulo,
    numero_rollo,
    pro_numero_rollo,
    grado,
    grupo,
    ancho_bruto,
    ancho_neto,
    metraje,
    empalme,
    lote_id,
    fecha_ingreso,
  } = tela;

  // Consulta SQL para insertar un nuevo registro de 'tela' en la base de datos
  const queryText = `
      INSERT INTO almacen_tela(tipo,articulo,numero_rollo,pro_numero_rollo,grado,grupo,ancho_bruto,ancho_neto,metraje,empalme,lote_id,fecha_ingreso) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Ejecuta la consulta con los detalles de la tela proporcionados
  const result = await query(queryText, [
    tipo,
    articulo,
    numero_rollo,
    pro_numero_rollo,
    grado,
    grupo,
    ancho_bruto,
    ancho_neto,
    metraje,
    empalme || null,
    lote_id,
    fecha_ingreso,
  ]);

  return {
    message: "Tela creada con éxito.",
    success: true,
    status: 201, // Estado 201 indica creación exitosa
  };
};

// Función para actualizar un registro existente de 'tela'
export const _UpdateTela = async (updateTela: any) => {
  try {
    // Consulta SQL para actualizar el registro de tela usando un procedimiento almacenado
    await query(`CALL SP_UpdateTela(?,?,?,?,?,?,?)`, [
      updateTela.tela_id,
      updateTela.tipo || null,
      updateTela.metraje || null,
      updateTela.articulo || null,
      updateTela.estado || null,
      updateTela.empresa_compra || null,
      updateTela.fecha_compra || null,
    ]);

    return {
      message: "Tela actualizada con éxito.",
      success: true,
      status: 200, // Estado 200 indica actualización exitosa
    };
  } catch (error: any) {
    return {
      message: "Error al actualizar la tela.",
      success: false,
      error: error.message || error,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};

// Función para desactivar un registro de tela (establecer su estado como 'inactivo')
export const _desactivarTela = async (tela_id: number) => {
  const queryS = `UPDATE almacen_tela SET estado = 0 WHERE tela_id = ?`;

  try {
    const result = (await query(queryS, [tela_id])) as any;

    if (result.affectedRows === 0) {
      return {
        msg: "No se encontró la tela", // Tela no encontrada
        success: false,
        status: 404, // Estado 404 indica que no se encontró el recurso
      };
    }

    return {
      msg: "Tela eliminada", // Tela desactivada exitosamente
      success: true,
      status: 200, // Estado 200 indica operación exitosa
    };
  } catch (error) {
    console.error("Error al eliminar la tela:", error);
    return {
      msg: "Error al eliminar la tela", // Mensaje de error general
      success: false,
      status: 500, // Estado 500 indica un error en el servidor
    };
  }
};

// Función para obtener todos los tipos únicos de 'tela'
export const _getTiposTelas = async () => {
  try {
    const result = await query(
      "select a_t.tipo from almacen_tela a_t group by a_t.tipo",
      []
    );
    return {
      items: result.data, // Retorna la lista de tipos únicos de tela
      success: true,
      status: 200, // Estado 200 indica recuperación exitosa
    };
  } catch (error) {
    return {
      msg: "Error _getTipos", // Mensaje de error
      success: false,
      status: 500, // Estado 500 indica error en el servidor
    };
  }
};

// Función para obtener todos los registros de tela usando un procedimiento almacenado
export const _getTelas = async () => {
  try {
    const result = await query("call SP_GetTelas()");

    return {
      items: result.data[0], // Retorna la lista de telas obtenida del procedimiento
      success: true,
      status: 200, // Estado 200 indica recuperación exitosa
    };
  } catch (error) {
    console.log(error);
    return {
      msg: error, // Retorna el mensaje de error si ocurre una excepción
      success: false,
      status: 500, // Estado 500 indica error en el servidor
    };
  }
};

// Función para obtener telas por id
export const _getTelasID = async (tela_id:Number) => {
  try {
    const result = await query(`
      SELECT almacen_tela.tela_id,almacen_tela.tipo,CONCAT(almacen_tela.pro_numero_rollo,"-",almacen_tela.lote_id) 
      as codigo_tela,almacen_tela.metraje from almacen_tela where almacen_tela.tela_id=${tela_id}
      `);

    return {
      items: result.data[0], // Retorna la lista de telas obtenida del procedimiento
      success: true,
      status: 200, // Estado 200 indica recuperación exitosa
    };
  } catch (error) {
    console.log(error);
    return {
      msg: error, // Retorna el mensaje de error si ocurre una excepción
      success: false,
      status: 500, // Estado 500 indica error en el servidor
    };
  }
};

// Función para obtener tela por su tipo y estado
export const _getTelaPorTipo = async (tipo_tela: string, estado: number) => {
  try {
    const result = await query("call SP_GetTelaPorTipo(?,?)", [
      tipo_tela,
      estado,
    ]);
    return {
      item: result.data[0], // Retorna la tela basada en su tipo y estado
      success: true,
      status: 200, // Estado 200 indica recuperación exitosa
    };
  } catch (error) {
    return {
      msg: error, // Retorna el mensaje de error si ocurre una excepción
      success: false,
      status: 500, // Estado 500 indica error en el servidor
    };
  }
};

export const _imprimirCodigos = async (res: any, lote_id: number) => {
  try {
    const JsBarcode = require("jsbarcode");
    const { createCanvas } = require("canvas");
    const PDFDocument = require("pdfkit-table");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="codigo_${lote_id}.pdf"`
    );

    const dataCodigos = await query(`
      SELECT almacen_tela.tela_id,
      CONCAT(almacen_tela.pro_numero_rollo,"-",almacen_tela.lote_id) 
      as codigo_tela from almacen_tela WHERE
      almacen_tela.lote_id=${lote_id}
      `);

    
    const doc = new PDFDocument({
      size: [100 * 2.83, 140 * 2.83],
      margin: 0,
    });
    
    doc.pipe(res);

    let posX = 0;
    let posY = 5;
    const spaceX = 4;
    const spaceY = 30;
    const barcodeWidth = 140;
    const barcodeHeight = 50;
    const maxCodesPerPage = 10;

    dataCodigos.data.forEach((item: any, i: number) => {

      if (i > 0 && i % maxCodesPerPage === 0) {
        doc.addPage();
        posX = 0;
        posY = 5;
      }

      const canvas = createCanvas(barcodeWidth, barcodeHeight);
      JsBarcode(canvas, item.tela_id, {
        format: "CODE128",
        width: 2,
        fontOptions: "bold",
        fontSize: 20,
        height: 100,
        displayValue: false
      });

      const imgData = canvas.toBuffer("image/png");

      doc.image(imgData, posX, posY, {
        width: barcodeWidth,
        height: barcodeHeight,
      });

      doc.fontSize(12).text(item.codigo_tela, posX, posY + barcodeHeight + 1,{
        align:"center",
        width:barcodeWidth
      })

      posX = (i + 1) % 2 === 0 ? 0 : posX + barcodeWidth + spaceX;
      posY += (i + 1) % 2 === 0 ? barcodeHeight + spaceY : 0;
    });

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al imprimir los códigos" });
  }
};
