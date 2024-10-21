import { _createTela } from "../service/telas";
import { query } from "../util/query";

const telas: any = [
  {
    tela_id: 1,
    tipo: "Algodón",
    metraje: 50.25,
    articulo: 101,
    empresa_compra: "TexPro",
    estado: 1,
    fecha_compra: "2024-01-15",
  },
  {
    tela_id: 2,
    tipo: "Seda",
    metraje: 30.0,
    articulo: 102,
    empresa_compra: "SedaLux",
    estado: 1,
    fecha_compra: "2024-02-10",
  },
  {
    tela_id: 3,
    tipo: "Poliéster",
    metraje: 100.75,
    articulo: 103,
    empresa_compra: "PolyTex",
    estado: 1,
    fecha_compra: "2024-03-05",
  },
  {
    tela_id: 4,
    tipo: "Lino",
    metraje: 75.5,
    articulo: 104,
    empresa_compra: "LinFashion",
    estado: 1,
    fecha_compra: "2024-01-25",
  },
  {
    tela_id: 5,
    tipo: "Denim",
    metraje: 120.0,
    articulo: 105,
    empresa_compra: "DenimWorks",
    estado: 2,
    fecha_compra: "2024-02-15",
  },
  {
    tela_id: 6,
    tipo: "Lana",
    metraje: 60.1,
    articulo: 106,
    empresa_compra: "WoolCo",
    estado: 1,
    fecha_compra: "2024-03-10",
  },
  {
    tela_id: 7,
    tipo: "Algodón",
    metraje: 45.2,
    articulo: 111,
    empresa_compra: "TexPro",
    estado: 1,
    fecha_compra: "2024-03-20",
  },
  {
    tela_id: 8,
    tipo: "Seda",
    metraje: 65.0,
    articulo: 112,
    empresa_compra: "SedaLux",
    estado: 1,
    fecha_compra: "2024-04-01",
  },
  {
    tela_id: 9,
    tipo: "Poliéster",
    metraje: 90.3,
    articulo: 113,
    empresa_compra: "PolyTex",
    estado: 1,
    fecha_compra: "2024-04-10",
  },
  {
    tela_id: 10,
    tipo: "Lino",
    metraje: 80.2,
    articulo: 114,
    empresa_compra: "LinFashion",
    estado: 1,
    fecha_compra: "2024-03-25",
  },
  {
    tela_id: 11,
    tipo: "Denim",
    metraje: 110.4,
    articulo: 115,
    empresa_compra: "DenimWorks",
    estado: 2,
    fecha_compra: "2024-02-20",
  },
  {
    tela_id: 12,
    tipo: "Lana",
    metraje: 72.5,
    articulo: 116,
    empresa_compra: "WoolCo",
    estado: 1,
    fecha_compra: "2024-04-05",
  },
  {
    tela_id: 13,
    tipo: "Algodón",
    metraje: 55.1,
    articulo: 117,
    empresa_compra: "TexPro",
    estado: 1,
    fecha_compra: "2024-04-15",
  },
  {
    tela_id: 14,
    tipo: "Seda",
    metraje: 25.0,
    articulo: 118,
    empresa_compra: "SedaLux",
    estado: 1,
    fecha_compra: "2024-04-20",
  },
  {
    tela_id: 15,
    tipo: "Poliéster",
    metraje: 150.9,
    articulo: 119,
    empresa_compra: "PolyTex",
    estado: 1,
    fecha_compra: "2024-04-25",
  },
  {
    tela_id: 16,
    tipo: "Lino",
    metraje: 45.0,
    articulo: 120,
    empresa_compra: "LinFashion",
    estado: 1,
    fecha_compra: "2024-03-28",
  },
  {
    tela_id: 17,
    tipo: "Denim",
    metraje: 90.0,
    articulo: 121,
    empresa_compra: "DenimWorks",
    estado: 2,
    fecha_compra: "2024-03-10",
  },
  {
    tela_id: 18,
    tipo: "Lana",
    metraje: 70.2,
    articulo: 122,
    empresa_compra: "WoolCo",
    estado: 1,
    fecha_compra: "2024-04-08",
  },
  {
    tela_id: 19,
    tipo: "Algodón",
    metraje: 65.0,
    articulo: 123,
    empresa_compra: "TexPro",
    estado: 1,
    fecha_compra: "2024-04-17",
  },
  {
    tela_id: 20,
    tipo: "Seda",
    metraje: 35.0,
    articulo: 124,
    empresa_compra: "SedaLux",
    estado: 1,
    fecha_compra: "2024-05-01",
  },
  {
    tela_id: 21,
    tipo: "Poliéster",
    metraje: 170.0,
    articulo: 125,
    empresa_compra: "PolyTex",
    estado: 1,
    fecha_compra: "2024-05-10",
  },
  {
    tela_id: 22,
    tipo: "Lino",
    metraje: 65.0,
    articulo: 126,
    empresa_compra: "LinFashion",
    estado: 1,
    fecha_compra: "2024-04-30",
  },
  {
    tela_id: 23,
    tipo: "Denim",
    metraje: 130.0,
    articulo: 127,
    empresa_compra: "DenimWorks",
    estado: 2,
    fecha_compra: "2024-03-20",
  },
  {
    tela_id: 24,
    tipo: "Lana",
    metraje: 85.0,
    articulo: 128,
    empresa_compra: "WoolCo",
    estado: 1,
    fecha_compra: "2024-05-15",
  },
  {
    tela_id: 25,
    tipo: "Algodón",
    metraje: 75.0,
    articulo: 129,
    empresa_compra: "TexPro",
    estado: 1,
    fecha_compra: "2024-05-20",
  },
  {
    tela_id: 26,
    tipo: "Seda",
    metraje: 40.0,
    articulo: 130,
    empresa_compra: "SedaLux",
    estado: 1,
    fecha_compra: "2024-05-25",
  },
  {
    tela_id: 27,
    tipo: "Poliéster",
    metraje: 120.0,
    articulo: 131,
    empresa_compra: "PolyTex",
    estado: 1,
    fecha_compra: "2024-05-30",
  },
  {
    tela_id: 28,
    tipo: "Lino",
    metraje: 55.0,
    articulo: 132,
    empresa_compra: "LinFashion",
    estado: 1,
    fecha_compra: "2024-04-28",
  },
  {
    tela_id: 29,
    tipo: "Denim",
    metraje: 115.0,
    articulo: 133,
    empresa_compra: "DenimWorks",
    estado: 2,
    fecha_compra: "2024-03-30",
  },
  {
    tela_id: 30,
    tipo: "Lana",
    metraje: 95.0,
    articulo: 134,
    empresa_compra: "WoolCo",
    estado: 1,
    fecha_compra: "2024-06-01",
  },
];

export const createTelas = async () => {
  try {
    for (const tela of telas) {
      const result = await query(
        "select * from almacen_telas where tipo = ? and metraje = ? and articulo = ?",
        [tela.tipo, tela.metraje, tela.articulo]
      );

      if (result.data.length === 0) {
        await _createTela(tela);
      }
    }
  } catch (error) {
    console.log("Error en createTienda:", error);
  }
};
