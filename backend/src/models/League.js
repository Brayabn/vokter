const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Competición deportiva (Liga BetPlay, Copa BetPlay, Mundial 2026...).
const League = sequelize.define('League', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  country: { type: DataTypes.STRING, defaultValue: '' },
  // Emoji identificativo, igual que en Category: evita depender de imágenes externas.
  icon: { type: DataTypes.STRING, defaultValue: '⚽' },
  season: { type: DataTypes.STRING, defaultValue: '' },
  // Orden de aparición en el carrusel de ligas destacadas.
  position: { type: DataTypes.INTEGER, defaultValue: 0 },
  // true = competición de demostración. VOKTER no tiene proveedor deportivo real:
  // la interfaz lo señala siempre para no presentarlo como información verificada.
  isDemo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'leagues',
  timestamps: true,
});

module.exports = League;
