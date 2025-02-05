export interface Lote {
  lote_id?: number;
  codigo_lote?: string;
  fecha_creacion?: string;
  rollos_tela: string;
  metraje: number;
  cantidad_total?: number;
  productos: string;
  estado?: number;
}
