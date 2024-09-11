import { DataTypes, Model } from "sequelize";
import { Incidencia as IncidenciaInterface } from "../interface/incidencia";
import sequelize from "../db/connection";
import { Usuario } from "./usuario";

export interface IncidenciaModel
  extends Model<IncidenciaInterface>,
    IncidenciaInterface {}

export const Incidencia = sequelize.define<IncidenciaModel>(
  "incidencia",
  {
    incidencia_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: false }
);

Incidencia.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  onDelete: "CASCADE",
});
