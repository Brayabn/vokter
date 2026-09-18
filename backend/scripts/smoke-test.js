/**
 * Prueba de humo de la API de VOKTER contra cualquier entorno.
 *
 *   npm run smoke -- http://localhost:4000/api
 *   npm run smoke -- https://<tu-servicio>.onrender.com/api
 *
 * Recorre los endpoints críticos (salud, catálogo, auth, favoritos, VOKTER AI)
 * y termina con código 1 si algo falla. Crea un usuario de prueba con un correo
 * único @vokter.test y deja sus favoritos como estaban.
 */
const BASE_URL = (process.argv[2] || process.env.API_URL || 'http://localhost:4000/api').replace(/\/+$/, '');

let failures = 0;

async function call(method, path, { body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, data };
}

function check(name, condition, detail = '') {
  console.log(`${condition ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures += 1;
}

async function main() {
  console.log(`API: ${BASE_URL}\n`);

  const health = await call('GET', '/health');
  check('GET /health', health.status === 200 && health.data.status === 'ok', `db=${health.data?.database}`);

  const categories = await call('GET', '/categories');
  check('GET /categories', categories.status === 200 && categories.data.categories.length >= 5,
    `${categories.data?.categories?.length} categorías`);

  const contents = await call('GET', '/contents');
  check('GET /contents', contents.status === 200 && contents.data.contents.length >= 10,
    `${contents.data?.contents?.length} contenidos`);

  const search = await call('GET', '/contents?search=SEO');
  check('GET /contents?search=SEO (sin distinguir mayúsculas)', search.status === 200 && search.data.contents.length >= 1,
    `${search.data?.contents?.length} resultado(s)`);

  const byCategory = await call('GET', '/contents?categorySlug=tecnologia');
  check('GET /contents?categorySlug=tecnologia', byCategory.status === 200 && byCategory.data.contents.length >= 1);

  const firstId = contents.data?.contents?.[0]?.id;
  const detail = await call('GET', `/contents/${firstId}`);
  check('GET /contents/:id', detail.status === 200 && Boolean(detail.data.content?.author));

  const invalid = await call('GET', '/contents/abc');
  check('GET /contents/abc → 404', invalid.status === 404);

  const experts = await call('GET', '/experts');
  check('GET /experts', experts.status === 200 && experts.data.experts.length >= 10,
    `${experts.data?.experts?.length} expertos`);

  const expertId = experts.data?.experts?.[0]?.id;
  const expert = await call('GET', `/experts/${expertId}`);
  check('GET /experts/:id', expert.status === 200 && Array.isArray(expert.data.contents),
    `${expert.data?.expert?.name}, ${expert.data?.contents?.length} contenido(s)`);

  const login = await call('POST', '/auth/login', { body: { email: 'demo@vokter.com', password: 'vokter123' } });
  check('POST /auth/login (demo)', login.status === 200 && Boolean(login.data.token));

  const badLogin = await call('POST', '/auth/login', { body: { email: 'demo@vokter.com', password: 'incorrecta' } });
  check('POST /auth/login (clave errónea) → 401', badLogin.status === 401);

  const email = `smoke.${Date.now()}@vokter.test`;
  const register = await call('POST', '/auth/register', { body: { name: 'Smoke Test', email, password: 'smoke123' } });
  check('POST /auth/register', register.status === 201 && Boolean(register.data.token));

  const token = register.data?.token;
  const me = await call('GET', '/auth/me', { token });
  check('GET /auth/me', me.status === 200 && me.data.user?.email === email);

  const noToken = await call('GET', '/favorites');
  check('GET /favorites sin token → 401', noToken.status === 401);

  const add = await call('POST', `/favorites/${firstId}`, { token });
  const addAgain = await call('POST', `/favorites/${firstId}`, { token });
  check('POST /favorites/:id (idempotente)', add.status === 201 && addAgain.status === 200);

  const favorites = await call('GET', '/favorites', { token });
  check('GET /favorites', favorites.status === 200 && favorites.data.favorites.some((f) => f.id === firstId && f.author));

  const remove = await call('DELETE', `/favorites/${firstId}`, { token });
  check('DELETE /favorites/:id', remove.status === 204);

  const match = await call('POST', '/ai/match', { body: { query: 'necesito ayuda con marketing y redes sociales' } });
  check('POST /ai/match (VOKTER AI)', match.status === 200 && match.data.results.length >= 1,
    match.data?.results?.map((r) => `${r.name} ${r.matchScore}%`).join(', '));

  const notFound = await call('GET', '/no-existe');
  check('Ruta inexistente → 404 JSON', notFound.status === 404 && typeof notFound.data === 'object');

  console.log(`\n${failures === 0 ? '✅ Todas las pruebas pasaron' : `❌ ${failures} prueba(s) fallaron`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(`❌ No se pudo conectar con ${BASE_URL}: ${err.cause?.code || err.message}`);
  process.exit(1);
});
