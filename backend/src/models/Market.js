const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Mercado de apuestas de un partido (1X2, más/menos goles, ambos marcan...).
// VOKTER no acepta dinero: estos mercados son informativos y demostrativos.
const Market = sequelize.define('Market', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // Tipo normalizado, para que la app sepa cómo dibujar las opciones.
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [['1X2', 'OVER_UNDER', 'BTTS', 'DOUBLE_CHANCE', 'QUALIFY', 'CORRECT_SCORE']] },
  },
  name: { type: DataTypes.STRING, allowNull: false },
  // Orden de aparición dentro de la ficha del partido.
  position: { type: DataTypes.INTEGER, defaultValue: 0 },
  // Se muestra en la sección "Mercados populares" del inicio.
  isPopular: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'markets',
  timestamps: true,
});

module.exports = Market;
