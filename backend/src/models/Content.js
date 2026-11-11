const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Content = sequelize.define('Content', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  // tags se guarda como CSV simple, usado por el motor de matching de VOKTER AI
  tags: { type: DataTypes.STRING, defaultValue: '' },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING, defaultValue: '' },
  // Precio en pesos colombianos (COP). null = precio a consultar.
  price: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0 } },
  // true = la foto es ilustrativa (del mismo tipo de artículo, no de la
  // referencia exacta). El catálogo lo señala de forma discreta en la tarjeta.
  isStock: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'contents',
  timestamps: true,
});

module.exports = Content;
