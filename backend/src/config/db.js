const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Usamos SQLite para desarrollo/evaluación: cero configuración, corre con un
// simple `npm install`. En producción basta con cambiar el dialect a 'mysql'
// o 'postgres' y ajustar las credenciales; los modelos no cambian.
const storagePath = process.env.DB_STORAGE || path.join(__dirname, '../../data/vokter.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false,
});

module.exports = sequelize;
