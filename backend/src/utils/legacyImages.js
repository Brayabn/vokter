/**
 * Fotos de fichas HEREDADAS: artículos que existen en bases de datos creadas
 * por versiones anteriores del proyecto (cuando VOKTER era un directorio de
 * expertos) y que NO figuran en `seedData.js` ni en `catalogData.js`.
 *
 * Al no estar en ningún archivo de siembra, el relleno de fotos del seed no las
 * alcanza: hay que buscarlas por su título. En una base nueva simplemente no
 * existen y este módulo no hace nada.
 *
 * Las fotos son ilustrativas (isStock: true): representan la actividad del
 * servicio, no una referencia comercial concreta.
 */
const img = (name) => `/api/media/catalogo/servicios/${name}.jpg`;

const LEGACY_IMAGES = {
  'Estrategia de marketing para emprendimientos': img('marketing'),
  'Optimización SEO y contenido que convierte': img('seo'),
  'Desarrollo de apps web y móviles a medida': img('apps'),
  'Automatización de procesos con IA': img('ia'),
  'Rediseño UX/UI de producto digital': img('uxui'),
  'Identidad visual y branding para tu marca': img('branding'),
  'Mentoría para validar tu modelo de negocio': img('mentoria'),
  'Orden financiero para pequeños negocios': img('finanzas'),
  'Clases personalizadas de inglés': img('ingles'),
  'Tutorías de matemáticas y ciencias': img('matematicas'),
};

/**
 * Rellena la foto de las fichas heredadas. Es IDEMPOTENTE y conservador:
 *   - busca por título exacto: no crea ni borra ningún registro;
 *   - solo escribe si el artículo NO tiene imagen, así que nunca pisa una foto
 *     ya asignada;
 *   - solo toca `imageUrl` e `isStock`: no modifica precio, descripción,
 *     nombre, autor, categoría, favoritos ni usuarios.
 *
 * Requiere que la columna `contents.isStock` exista: llamar siempre DESPUÉS de
 * `ensureSchema()`.
 *
 * @param {object} Content  modelo Sequelize de artículos
 * @param {{dry?: boolean}} options  dry: simula sin escribir
 */
async function backfillLegacyImages(Content, { dry = false } = {}) {
  const result = { updated: 0, alreadyHad: 0, notFound: [], titles: [] };

  for (const [title, imageUrl] of Object.entries(LEGACY_IMAGES)) {
    const content = await Content.findOne({ where: { title } });
    if (!content) {
      result.notFound.push(title); // base nueva: la ficha no existe, nada que hacer
      continue;
    }
    if (content.imageUrl) {
      result.alreadyHad += 1;
      continue;
    }
    if (!dry) await content.update({ imageUrl, isStock: true });
    result.updated += 1;
    result.titles.push(title);
  }

  return result;
}

module.exports = { LEGACY_IMAGES, backfillLegacyImages };
