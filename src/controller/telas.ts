import { Request, Response } from "express";
import { handleHttp } from "../util/error.handler";
import {
  _createTela,
  _desactivarTela,
  _getTelaPorTipo,
  _getTelas,
  _getTelasID,
  _getTiposTelas,
  _imprimirCodigos,
  _UpdateTela,
} from "../service/tela";
import { _getTiendas } from "../service/tienda";
import { AlmacenTela } from "../interface/almacenTela";
import ExcelJs from "exceljs"
import { query } from "../util/query";

export const createTela = async (req: Request, res: Response) => {
  
  const telasCreadas: any[] = [];

  const libro = new ExcelJs.Workbook();
  await libro.xlsx.readFile(req.file.path)
  const hoja = libro.worksheets[0]

  const datosTelas:AlmacenTela[] = [];

  const datosLote = await query("SELECT COALESCE(MAX(lote_id), 1) AS lote_id FROM almacen_tela");


  hoja.eachRow({includeEmpty:false},(row,rowNumber)=>{
    if(rowNumber>1){
      const values = (row.values as any[])?.slice(1) || [];
      const [articulo,numero_rollo,pro_numero_rollo,grado,grupo,ancho_bruto,ancho_neto,metraje,empalme] = values;
      const articulo_modificado = articulo.substring(9);
      datosTelas.push({
        tipo:"JEANS",
        articulo:articulo_modificado,
        numero_rollo,
        pro_numero_rollo,
        grado,
        grupo,
        ancho_bruto,
        ancho_neto,
        metraje,
        empalme,
        lote_id:datosLote.data[0].lote_id+1,
        fecha_ingreso: new Date().toISOString().split('T')[0], 
      })
    }
  })

  try {
    const respuesta = await Promise.all(
      datosTelas.map(async (tela) => {_createTela(tela).catch((error)=>{console.log(error)})})         
    )

    telasCreadas.push(...respuesta)

    res.status(200).json(datosLote.data[0].lote_id+1)
    
  } catch (error) {
    return handleHttp(res, "error_createTela", 500);
  }

};

export const updateTela = async (req: Request, res: Response) => {
  const { tela_id } = req.params;

  const { tipo, metraje, articulo, estado, empresa_compra, fecha_compra } =
    req.body;

  const updateTela: any = {
    tela_id: Number(tela_id),
    tipo,
    metraje,
    articulo,
    estado,
    empresa_compra,
    fecha_compra,
  };

  try {
    const response = await _UpdateTela(updateTela);
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_createCompra", 500);
  }
};

export const desactivarTela = async (req: Request, res: Response) => {
  const { tela_id } = req.params;
  try {
    const response = await _desactivarTela(Number(tela_id));
    res.status(response.status).json(response);
  } catch (error) {
    handleHttp(res, "error_desactivarTela", 500);
  }
};

export const getTipos = async (req: Request, res: Response) => {
  try {
    const response = await _getTiposTelas();
    res
      .status(response.status)
      .json(response.items ? response.items : response);
  } catch (error) {
    handleHttp(res, "error_getTipos", 500);
  }
};

export const imprimirCodigos = async(req:Request,res:Response)=>{
  const {lote_id} = req.params;
  try {
    const response = await _imprimirCodigos(res,Number(lote_id));
    res.status(200);
  } catch (error) {  
    handleHttp(res, "error_imprimirCodigo", 500); 
  }
}

export const getTelas = async (req: Request, res: Response) => {
  try {
    const response = await _getTelas();
    res
      .status(response.status)
      .json(response.items ? response.items : response);
  } catch (error) {
    handleHttp(res, "error_getTelas", 500);
  }
};

export const getTelasID = async (req: Request, res: Response) => {
  
  const { tela_id } = req.params;

  try {
    const response = await _getTelasID(Number(tela_id));
    res
      .status(response.status)
      .json(response.items ? response.items : response);
  } catch (error) {
    handleHttp(res, "error_getTelas", 500);
  }
};


export const getTelaPorTipo = async (req: Request, res: Response) => {
  const { tipo_tela } = req.params;
  const estado = req.query.estado;

  console.log(tipo_tela, estado);

  try {
    const response = await _getTelaPorTipo(tipo_tela, Number(estado));
    res.status(response.status).json(response.item ? response.item : response);
  } catch (error) {
    handleHttp(res, "error_getTelas", 500);
  }
};
