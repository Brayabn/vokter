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
  // Jornada o fase, cuando el proveedor la publica.
  round: { type: DataTypes.STRING, allowNull: true },
  // Goles y tarjetas en JSON, tal y como los da el proveedor. Se guarda como
  // texto para no exigir un tipo JSON concreto al motor de base de datos.
  events: { type: DataTypes.TEXT, allowNull: true },
  isDemo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'matches',
  timestamps: true,
});

module.exports = Match;
