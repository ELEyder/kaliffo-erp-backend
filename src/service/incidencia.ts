import { query } from "../util/query";

export const _createIncidencia = async (incidencia: any) => {
  const { tipo, descripcion, usuario_id } = incidencia;
  incidencia.fecha_creacion = new Date();

  const queryS = `
    INSERT INTO incidencia (tipo,descripcion,usuario_id, fecha_creacion)
    VALUES (?, ?, ?, ?)`;

  try {
    const result = await query(queryS, [
      tipo,
      descripcion,
      usuario_id,
      incidencia.fecha_creacion,
    ]);

    return {
      message: "EXITO AL AÑADIR",
      success: true,
      status: 201,
    };
  } catch (error) {
    console.error("Error al crear incidencia:", error);
    return {
      msg: "error _createIncidencia",
      success: false,
      status: 500,
    };
  }
};

export const _getIncidencias = async (usuario_id?: number) => {
  const consulta = usuario_id
    ? `SELECT * FROM incidencia WHERE usuario_id = ?`
    : `SELECT * FROM incidencia`;

  try {
    const result = (await query(consulta, [usuario_id])) as any;

    return {
      items: result.data,
      success: true,
      status: 200,
    };
  } catch (error) {
    console.error("Error al obtener incidencias:", error);
    return {
      msg: "error _getIncidencias",
      success: false,
      status: 500,
    };
  }
};

export const _getIncidencia = async (incidencia_id: number) => {
  const queryS = `SELECT * FROM incidencia WHERE incidencia_id = ?`;

  try {
    const [item] = (await query(queryS, [incidencia_id])) as any;

    if (item.length === 0) {
      return {
        msg: "Incidencia no encontrada",
        success: false,
        status: 404,
      };
    }

    return {
      item: item[0],
      success: true,
      status: 200,
    };
  } catch (error) {
    console.error("Error al obtener la incidencia:", error);
    return {
      msg: "error _getIncidencia",
      success: false,
      status: 500,
    };
  }
};

export const _deleteIncidencia = async (incidencia_id: number) => {
  const queryS = `DELETE FROM incidencia WHERE incidencia_id = ?`;

  try {
    const result = (await query(queryS, [incidencia_id])) as any;

    // Aquí accedes directamente a result.affectedRows, ya que no es un arreglo
    if (result.affectedRows === 0) {
      return {
        msg: "No se encontró la incidencia",
        success: false,
        status: 404,
      };
    }

    return {
      msg: "Incidencia eliminada",
      success: true,
      status: 200,
    };
  } catch (error) {
    console.error("Error al eliminar la incidencia:", error);
    return {
      msg: "Error al eliminar la incidencia",
      success: false,
      status: 500,
    };
  }
};

export const _updateIncidencia = async (
  incidencia_id: number,
  updatedIncidencia: any
) => {
  const { tipo, descripcion } = updatedIncidencia;

  try {
    const result = await query(`CALL SP_UpdateIncidencia(?,?,?,?)`, [
      incidencia_id,
      tipo || null,
      descripcion || null,
      null,
    ]);

    if (result.affectedRows === 0) {
      return {
        msg: "Incidencia no encontrada o no actualizada",
        success: false,
        status: 404,
      };
    }

    return {
      msg: "Incidencia actualizada correctamente",
      success: true,
      status: 200,
    };
  } catch (error) {
    console.error("Error al actualizar la incidencia:", error);
    return {
      msg: "error _updateIncidencia",
      success: false,
      status: 500,
    };
  }
};
