/**
 * Rellena la foto de las fichas HEREDADAS (los 10 servicios de la versión
 * anterior del proyecto) en la base de datos a la que apunte DATABASE_URL.
 *
 * Desde ahora NO hace falta ejecutarlo a mano: el arranque del backend ya llama
 * a la misma función (`seedDemoData()` -> `backfillLegacyImages()`) cuando
 * SEED_DEMO_DATA=true. Este script se conserva como herramienta de verificación
 * y para entornos donde el seed automático esté desactivado.
 *
 * La lógica vive en `src/utils/legacyImages.js` para que el seed y este script
 * compartan exactamente el mismo comportamiento. Es seguro y repetible: busca
 * por título exacto, no crea ni borra registros, solo escribe cuando el
 * artículo no tiene imagen y solo toca `imageUrl` e `isStock`.
 *
 * Uso:
 *   node scripts/backfill-service-images.js --dry   (simulación, no escribe)
 *   node scripts/backfill-service-images.js         (aplica los cambios)
 */
const { sequelize, Content } = require('../src/models');
const { ensureSchema } = require('../src/utils/schema');
const { backfillLegacyImages, LEGACY_IMAGES } = require('../src/utils/legacyImages');

async function main() {
  const dry = process.argv.includes('--dry');

  await sequelize.authenticate();
  console.log(`Base de datos: ${sequelize.getDialect()}${dry ? '  ·  MODO SIMULACIÓN (no escribe)' : ''}`);

  // La columna `isStock` tiene que existir antes de escribir en ella.
  // ensureSchema() es aditivo e idempotente.
  await ensureSchema();

  const r = await backfillLegacyImages(Content, { dry });

  r.titles.forEach((t) => console.log(`${dry ? '[simulación] ' : ''}✔ ${t}  ->  ${LEGACY_IMAGES[t]}`));
  console.log(`\n${dry ? 'Se modificarían' : 'Actualizados'}: ${r.updated} · Ya tenían foto: ${r.alreadyHad} · Sin ficha en esta base: ${r.notFound.length}`);
  r.notFound.forEach((t) => console.log(`   – no existe aquí: ${t}`));

  await sequelize.close();
}

main().catch(async (err) => {
  console.error('❌ Error:', err.message);
  await sequelize.close().catch(() => {});
  process.exit(1);
});
