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
  // --- Procedencia del dato (VOKTER 2.0) ---
  // Identificador en el proveedor de origen. Junto con `source` distingue cada
  // registro real y evita duplicarlo al volver a sincronizar.
  externalId: { type: DataTypes.STRING, allowNull: true },
  // De donde sale el dato: 'demo' para los ficticios de la maqueta anterior, o
  // el id del proveedor ('openligadb', 'openfootball'...). Nunca se mezclan.
  source: { type: DataTypes.STRING, allowNull: false, defaultValue: 'demo' },
  // Cuando se trajo por ultima vez del proveedor. La interfaz lo muestra para
  // que nadie confunda un dato viejo con un marcador al minuto.
  syncedAt: { type: DataTypes.DATE, allowNull: true },
  isDemo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'leagues',
  timestamps: true,
});

module.exports = League;
