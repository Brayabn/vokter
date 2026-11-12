const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Encuentro entre dos equipos de una competición.
const Match = sequelize.define('Match', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // Clave natural del encuentro de demostracion: permite volver a sembrar sin
  // duplicar y sin depender del id autoincremental.
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  startsAt: { type: DataTypes.DATE, allowNull: false },
  // scheduled = aún no empieza · live = en juego · finished = terminado
  status: {
    type: DataTypes.STRING,
    defaultValue: 'scheduled',
    validate: { isIn: [['scheduled', 'live', 'finished']] },
  },
  // Marcador. null mientras el partido no ha empezado.
  homeScore: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0 } },
  awayScore: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0 } },
  // Minuto de juego; solo tiene sentido con status 'live'.
  minute: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 130 } },
  stadium: { type: DataTypes.STRING, defaultValue: '' },
  // Aparece en "Partidos populares" de la pantalla de inicio.
  isPopular: { type: DataTypes.BOOLEAN, defaultValue: false },
  isDemo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'matches',
  timestamps: true,
});

module.exports = Match;
