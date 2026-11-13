const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Equipo participante. Sin escudos externos: se identifica por iniciales y un
// color, que la app dibuja como insignia. Así no dependemos de logotipos de
// terceros ni de archivos que podrían faltar.
const Team = sequelize.define('Team', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  shortName: { type: DataTypes.STRING, defaultValue: '' },
  // Dos o tres letras para la insignia circular.
  initials: { type: DataTypes.STRING, defaultValue: '' },
  // Color de la insignia, en hexadecimal (#RRGGBB).
  color: { type: DataTypes.STRING, defaultValue: '#1E6BFF' },
  country: { type: DataTypes.STRING, defaultValue: '' },
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
  // Escudo oficial publicado por el proveedor. Si no hay, la app dibuja las
  // iniciales sobre el color: nunca se usa el escudo de otro equipo.
  crestUrl: { type: DataTypes.STRING, allowNull: true },
  isDemo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'teams',
  timestamps: true,
});

module.exports = Team;
