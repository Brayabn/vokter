const { Sequelize } = require('sequelize');
const path = require('path');
const { config } = require('./env');

// Producción: PostgreSQL (Neon) vía DATABASE_URL, con SSL obligatorio.
// Desarrollo: SQLite en un archivo local, sin instalar ni configurar nada.
// Los modelos y controladores son los mismos en ambos casos (Sequelize abstrae el motor).
let sequelize;

if (config.databaseUrl) {
  sequelize = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: config.databaseSsl
      ? { ssl: { require: true, rejectUnauthorized: true } } // Neon: TLS con certificado verificado
      : {},
    pool: { max: 5, min: 0, idle: 10000 },
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.dbStorage || path.join(__dirname, '../../data/vokter.sqlite'),
    logging: false,
  });
}

module.exports = sequelize;
