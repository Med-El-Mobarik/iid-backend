const db = require("../config/db");
const { DataTypes } = require("sequelize");

const Module = db.define("Module", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  showname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  annee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semestre: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Module;
