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
  isDemo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'teams',
  timestamps: true,
});

module.exports = Team;
