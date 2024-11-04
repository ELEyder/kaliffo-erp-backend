import { Corte } from "../interface/corte";
import { query } from "../util/query";
import { _createLavanderia } from "./lavanderia";

export const _createCorte = async (corte: Corte) => {
  const {
    lote_id,
    taller_id,
    producto_id,
    cantidad_enviada,
    talla,
    metraje_asignado,
    tipo_tela,
  } = corte;

  const queryText = `
        INSERT INTO cortes (lote_id ,taller_id ,producto_id ,cantidad_enviada ,talla ,metraje_asignado ,tipo_tela) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const result = await query(queryText, [
    lote_id,
    taller_id,
    producto_id,
    cantidad_enviada,
    talla,
    metraje_asignado,
    tipo_tela,
  ]);

  return {
    message: "corte creada con éxito.",
    success: true,
    status: 201,
  };
};

export const _UpdateCorte = async (updateCorte: any) => {
  try {
    await query(`CALL SP_UpdateCorte(?,?,?,?,?,?,?)`, [
      updateCorte.corte_id,
      updateCorte.taller_id || null,
      updateCorte.producto_id || null,
      updateCorte.cantidad || null,
      updateCorte.talla || null,
      updateCorte.metraje_asignado || null,
      updateCorte.tipo_tela || null,
    ]);

    return {
      message: "Corte actualizada con éxito.",
      success: true,
      status: 200,
    };
  } catch (error: any) {
    return {
      message: "Error al actualizar el corte.",
      success: false,
      error: error.message || error,
      status: 500,
    };
  }
};

export const _getCortes = async () => {
  try {
    const queryText = `SELECT * FROM cortes`;
    const result = await query(queryText);

    return {
      items: result.data || [],
      success: true,
      status: 200,
    };
  } catch (error: any) {
    return {
      message: "Error al obtener los cortes.",
      success: false,
      error: error.message || error,
      status: 500,
    };
  }
};

export const _getCortesPorLote = async (lote_id: number) => {
  try {
    const queryText = `SELECT cortes.corte_id, usuario.nombre,producto.nombre,cortes.cantidad_enviada,cortes.cantidad_recibida,cortes.talla,cortes.metraje_asignado,cortes.tipo_tela FROM cortes inner JOIN
usuario on cortes.taller_id = usuario.usuario_id INNER JOIN producto on producto.producto_id = cortes.producto_id where cortes.lote_id=?`;
    const result = await query(queryText, [lote_id]);
    if (result.data && result.data.length === 0) {
      return {
        message: "Cortes no encontrados.",
        success: false,
        status: 404,
      };
    }

    return {
      items: result.data || [],
      success: true,
      status: 200,
    };
  } catch (error: any) {
    return {
      message: "Error al obtener los cortes.",
      success: false,
      error: error.message || error,
      status: 500,
    };
  }
};

export const _getTallas = async () => {
  try {
    const queryText = `SELECT cortes.talla from cortes group by cortes.talla`;
    const result = await query(queryText);
    return {
      items: result.data || [],
      success: true,
      status: 200,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error al obtener las tallas.",
      success: false,
      error: error.message || error,
      status: 500,
    };
  }
};

export const _getCorte = async (corte_id: number) => {
  try {
    const queryText = `SELECT * FROM cortes WHERE corte_id = ?`;
    const result = await query(queryText, [corte_id]);
    console.log(result);

    return {
      item: result.data,
      success: true,
      status: 200,
    };
  } catch (error: any) {
    return {
      message: "Error al obtener el corte.",
      success: false,
      error: error.message || error,
      status: 500,
    };
  }
};

export const _sgtEstadoCorte = async (
  corte_id: number,
  cantidad_recibida?: number
) => {
  try {
    const result = await query("SELECT * FROM cortes WHERE corte_id = ?", [
      corte_id,
    ]);

    const corte = result.data[0] as any;

    if (!corte) {
      return {
        message: "No se encontró el corte",
        success: false,
        status: 404,
      };
    }

    switch (corte.estado) {
      case 0:
        return {
          message: "Este corte está desactivado",
          success: false,
          status: 404,
        };
      case 1:
        const updateCorte1 = await query(
          "UPDATE cortes SET estado = 2 WHERE corte_id = ?",
          [corte_id]
        );
        if (updateCorte1.affectedRows > 0) {
          return {
            message: "El corte ha pasado al estado 2 (en proceso)",
            nuevoEstado: 2,
            success: true,
            status: 200,
          };
        } else {
          return {
            message: "No se pudo actualizar el estado del corte a 2",
            success: false,
            status: 500,
          };
        }
      case 2:
        if (cantidad_recibida === undefined) {
          return {
            message: "Campo 'cantidad_recibida' obligatorio.",
            success: false,
            status: 500,
          };
        }

        const updateCorte2 = await query(
          "UPDATE cortes SET estado = 3, cantidad_recibida = ? WHERE corte_id = ?",
          [cantidad_recibida, corte_id]
        );

        const updateLote = await query(
          "update lotes set estado = 2, cantidad_total = ? where lote_id = ?",
          [cantidad_recibida, corte.lote_id]
        );

        if (updateCorte2.affectedRows > 0 && updateLote.affectedRows > 0) {
          return {
            message: "El corte ha pasado al estado 3 (finalizado)",
            nuevoEstado: 3,
            success: true,
            status: 200,
          };
        } else {
          return {
            message: "No se pudo actualizar el estado del corte a 3 o lote",
            success: false,
            status: 500,
          };
        }
      case 3:
        return {
          message: "Este corte está finalizado",
          success: false,
          status: 400,
        };
      default:
        return {
          message: "Estado del corte no reconocido",
          success: false,
          status: 400,
        };
    }
  } catch (error: any) {
    return {
      msg: "Error en _sgtEstadoCorte",
      error: error.message,
      success: false,
      status: 500,
    };
  }
};

export const _desactivarCorte = async (corte_id: number) => {
  const queryText =
    "UPDATE cortes SET estado = 0 WHERE corte_id = ? AND estado != 0;";

  try {
    const result = await query(queryText, [corte_id]);

    if (result.success && result.affectedRows > 0) {
      return {
        message: `El corte con ID ${corte_id} ha sido desactivada correctamente.`,
        success: true,
        status: 200,
      };
    } else {
      return {
        message: `No se encontró corte con ID ${corte_id} o ya estaba desactivada.`,
        success: false,
        status: 400,
      };
    }
  } catch (error: any) {
    console.error("Error al desactivar corte:", error);
    return {
      message: error.message || "Error desconocido al desactivar corte.",
      success: false,
      status: 500,
    };
  }
};

export const _activarCorte = async (corte_id: number) => {
  const queryText =
    "UPDATE cortes SET estado = true WHERE corte_id = ? AND estado != true;";

  try {
    const result = await query(queryText, [corte_id]);

    if (result.success && result.affectedRows > 0) {
      return {
        message: `El corte con ID ${corte_id} ha sido activada correctamente.`,
        success: true,
        status: 200,
      };
    } else {
      return {
        message: `No se encontró corte con ID ${corte_id} o ya estaba activada.`,
        success: false,
        status: 400,
      };
    }
  } catch (error: any) {
    console.error("Error al activar corte:", error);
    return {
      message: error.message || "Error desconocido al activar corte.",
      success: false,
      status: 500,
    };
  }
};
