const bcrypt = require('bcryptjs');
const { config } = require('../config/env');
const { sequelize, User, Category, Content } = require('../models');
const { DEMO_PASSWORD, CATEGORIES, EXPERTS, DEMO_USER, CONTENTS } = require('./seedData');

/**
 * Siembra los datos demo de forma IDEMPOTENTE: usa findOrCreate con claves
 * naturales (slug, email, título+autor), así que puede ejecutarse muchas veces
 * sin duplicar registros ni tocar los datos que ya existen (p. ej. usuarios
 * reales registrados o favoritos).
 */
async function seedDemoData() {
  const counts = { categories: 0, users: 0, contents: 0 };
  let passwordHash = null; // se calcula solo si hay que crear usuarios

  const categoryBySlug = {};
  for (const data of CATEGORIES) {
    const [category, created] = await Category.findOrCreate({ where: { slug: data.slug }, defaults: data });
    categoryBySlug[data.slug] = category;
    if (created) counts.categories += 1;
  }

  const userByEmail = {};
  for (const data of [...EXPERTS, DEMO_USER]) {
    let user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      passwordHash = passwordHash || (await bcrypt.hash(DEMO_PASSWORD, 10));
      user = await User.create({ ...data, passwordHash });
      counts.users += 1;
    }
    userByEmail[data.email] = user;
  }

  for (const { categorySlug, authorEmail, ...data } of CONTENTS) {
    const authorId = userByEmail[authorEmail].id;
    const [, created] = await Content.findOrCreate({
      where: { title: data.title, authorId },
      defaults: { ...data, authorId, categoryId: categoryBySlug[categorySlug].id },
    });
    if (created) counts.contents += 1;
  }

  return counts;
}

// Uso por consola:
//   npm run seed          -> idempotente (seguro en cualquier entorno)
//   npm run seed:reset    -> BORRA y recrea todas las tablas (solo desarrollo)
async function runCli() {
  const reset = process.argv.includes('--reset');
  if (reset && config.isProduction) {
    throw new Error('--reset está bloqueado en producción: borraría todos los datos.');
  }

  await sequelize.authenticate();
  await sequelize.sync(reset ? { force: true } : {});
  const counts = await seedDemoData();

  console.log(`✅ Seed completado (${sequelize.getDialect()}${reset ? ', tablas recreadas' : ''}). Nuevos registros:`, counts);
  console.log(`   Usuarios demo (password: ${DEMO_PASSWORD}): demo@vokter.com y 10 expertos @vokter.com`);
  await sequelize.close();
}

if (require.main === module) {
  runCli().catch(async (err) => {
    console.error('❌ Error en el seed:', err.message);
    await sequelize.close().catch(() => {});
    process.exit(1);
  });
}

module.exports = { seedDemoData };
