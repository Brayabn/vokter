const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');

/**
 * sync() crea tablas faltantes pero no añade columnas nuevas a tablas existentes
 * (p. ej. la base de producción en Neon). Aquí se añaden de forma ADITIVA y
 * idempotente: nunca se borra ni se modifica una columna existente.
 */
const ADDITIVE_COLUMNS = [
  { table: 'contents', column: 'price', spec: { type: DataTypes.INTEGER, allowNull: true } },
];

async function ensureSchema() {
  const qi = sequelize.getQueryInterface();
  for (const { table, column, spec } of ADDITIVE_COLUMNS) {
    const columns = await qi.describeTable(table);
    if (!columns[column]) {
      await qi.addColumn(table, column, spec);
      console.log(`🧩 Columna añadida: ${table}.${column}`);
    }
  }
}

module.exports = { ensureSchema };
