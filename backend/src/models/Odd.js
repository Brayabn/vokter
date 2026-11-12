const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Una opción de un mercado con su cuota. Cuota en formato decimal europeo
// (2.45 = se multiplica por 2,45). Valores DEMOSTRATIVOS: no provienen de
// ninguna casa de apuestas y no sirven para apostar.
const Odd = sequelize.define('Odd', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // Etiqueta corta de la opción: "1", "X", "2", "Más 2.5", "Sí", "1X"...
  label: { type: DataTypes.STRING, allowNull: false },
  // Texto largo opcional para lectores de pantalla y pantallas anchas.
  description: { type: DataTypes.STRING, defaultValue: '' },
  value: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 1 } },
  position: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'odds',
  timestamps: true,
});

module.exports = Odd;
