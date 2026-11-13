const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');

/**
 * sync() crea tablas faltantes pero no añade columnas nuevas a tablas existentes
 * (p. ej. la base de producción en Neon). Aquí se añaden de forma ADITIVA y
 * idempotente: nunca se borra ni se modifica una columna existente.
 *
 * Esto es lo único que toca el esquema de producción. No hay DROP, no hay
 * ALTER sobre columnas ya creadas y no se recrea ninguna tabla: los usuarios,
 * las contraseñas, los favoritos y el catálogo quedan intactos.
 */
const PROCEDENCIA = [
  { column: 'externalId', spec: { type: DataTypes.STRING, allowNull: true } },
  { column: 'source', spec: { type: DataTypes.STRING, allowNull: false, defaultValue: 'demo' } },
  { column: 'syncedAt', spec: { type: DataTypes.DATE, allowNull: true } },
];

const ADDITIVE_COLUMNS = [
  { table: 'contents', column: 'price', spec: { type: DataTypes.INTEGER, allowNull: true } },
  { table: 'contents', column: 'isStock', spec: { type: DataTypes.BOOLEAN, defaultValue: false } },

  // Procedencia de los datos deportivos (VOKTER 2.0)
  ...['leagues', 'teams', 'matches'].flatMap((table) =>
    PROCEDENCIA.map(({ column, spec }) => ({ table, column, spec }))
  ),
  { table: 'teams', column: 'crestUrl', spec: { type: DataTypes.STRING, allowNull: true } },
  { table: 'matches', column: 'round', spec: { type: DataTypes.STRING, allowNull: true } },
  { table: 'matches', column: 'events', spec: { type: DataTypes.TEXT, allowNull: true } },
];

/**
 * Índices únicos sobre (source, externalId).
 *
 * Son la defensa real contra los duplicados: sin ellos, dos sincronizaciones
 * solapadas podrían insertar el mismo encuentro dos veces aunque el código
 * compruebe antes de escribir. Se crean con IF NOT EXISTS, así que volver a
 * ejecutarlo no falla.
 *
 * Son índices PARCIALES: solo cubren las filas con `externalId`, porque los
 * registros de demostración no tienen y varios NULL no deben chocar entre sí.
 */
const INDICES_UNICOS = [
  { table: 'leagues', name: 'leagues_source_external_unico' },
  { table: 'teams', name: 'teams_source_external_unico' },
  { table: 'matches', name: 'matches_source_external_unico' },
];

async function crearIndices(qi) {
  const dialecto = sequelize.getDialect();
  for (const { table, name } of INDICES_UNICOS) {
    try {
      if (dialecto === 'postgres') {
        await sequelize.query(
          `CREATE UNIQUE INDEX IF NOT EXISTS "${name}" ON "${table}" ("source", "externalId") WHERE "externalId" IS NOT NULL`
        );
      } else {
        await sequelize.query(
          `CREATE UNIQUE INDEX IF NOT EXISTS \`${name}\` ON \`${table}\` (\`source\`, \`externalId\`) WHERE \`externalId\` IS NOT NULL`
        );
      }
    } catch (err) {
      // Un índice que no se puede crear no debe impedir que el servicio
      // arranque: se registra y el código sigue comprobando antes de escribir.
      console.warn(`⚠️  No se pudo crear el índice ${name}: ${err.message}`);
    }
  }
}

async function ensureSchema() {
  const qi = sequelize.getQueryInterface();
  for (const { table, column, spec } of ADDITIVE_COLUMNS) {
    let columns;
    try {
      columns = await qi.describeTable(table);
    } catch {
      continue; // la tabla aún no existe; sync() la creará con todas sus columnas
    }
    if (!columns[column]) {
      await qi.addColumn(table, column, spec);
      console.log(`🧩 Columna añadida: ${table}.${column}`);
    }
  }
  await crearIndices(qi);
}

module.exports = { ensureSchema };
