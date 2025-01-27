export interface AlmacenTela {
  tela_id?: number;             // ID único del registro, opcional para nuevas entradas
  tipo: string;                 // Tipo de tela
  articulo: string;             // Artículo asociado
  numero_rollo: string;         // Número único del rollo
  pro_numero_rollo: string;     // Número de rollo del proveedor
  grado: string;                // Grado del rollo (un solo carácter)
  grupo: string;                // Grupo asociado (tres caracteres)
  ancho_bruto: number;          // Ancho bruto en decimal
  ancho_neto: number;           // Ancho neto en decimal
  metraje: number;              // Metraje total
  empalme: string;              // Detalles de empalme
  lote_id: number;               // ID del lote de la tela
  estado?: number;              // Estado con valor predeterminado 1
  fecha_ingreso: string;       // Fecha de ingreso (ISO 8601)
  fecha_salida?: string;        // Fecha de salida (ISO 8601)
}
