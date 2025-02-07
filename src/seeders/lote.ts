import { Lote } from "../interface/lote";
import { _createLote } from "../service/lote";
import { query } from "../util/query";

const lotes: Lote[] = [
  {
    lote_id: 1,
    rollos_tela: "licra",
    metraje: 160,
    productos: "1,3,4",
  },
  {
    lote_id: 2,
    rollos_tela: "algodón",
    metraje: 200,
    productos: "2,5,6",
  },
  {
    lote_id: 3,
    rollos_tela: "denim",
    metraje: 180,
    productos: "4,7,8",
  },
  {
    lote_id: 4,
    rollos_tela: "poliéster",
    metraje: 150,
    productos: "4,6",
  },
  {
    lote_id: 5,
    rollos_tela: "seda",
    metraje: 120,
    productos: "3,4,5",
  },
];

export const createLotes = async () => {
  try {
    for (const lote of lotes) {
      const result = await query("select * from lote where lote_id = ?", [
        lote.lote_id,
      ]);
      if (result.data.length === 0) {
        await _createLote(lote);
      }
    }
  } catch (error) {
    console.log("Error en createLote:", error);
  }
};
