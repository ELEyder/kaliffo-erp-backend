import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";
import { Horario as HorarioInteface } from "../interface/horario";
import { Usuario } from "./usuario";

export interface HorarioModel extends Model<HorarioInteface>, HorarioInteface {}

export const Horario = sequelize.define<HorarioModel>(
  "horario",
  {
    horario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hora_entrada: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hora_salida: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Horario.belongsTo(Usuario, {
  foreignKey: "usuario_id",
});
