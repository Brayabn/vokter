const { getJson } = require('./httpClient');

/**
 * Proveedor TheSportsDB (https://www.thesportsdb.com).
 *
 * Usa la clave de prueba pública que el propio proyecto documenta para uso
 * libre. No es una credencial privada: no hay cuenta, no hay registro y no hay
 * nada que proteger, por eso puede vivir en el repositorio. Aun así se deja
 * configurable por si conviene cambiarla.
 *
 * Como toda fuente gratuita, su cobertura hay que comprobarla, no suponerla:
 * `probarCobertura()` descubre en ejecución qué competiciones existen de verdad
 * y cuántos encuentros devuelven.
 */

const CLAVE_PUBLICA = process.env.SPORTSDB_PUBLIC_KEY || '3';
const BASE = `https://www.thesportsdb.com/api/v1/json/${CLAVE_PUBLICA}`;

/**
 * Competiciones que nos interesan, buscadas por su nombre en el proveedor.
 * El identificador numérico NO se escribe a mano: se descubre consultando al
 * proveedor, para no inventar ids que podrían apuntar a otra liga.
 */
const COMPETICIONES = [
  { slug: 'col.1', nombre: 'Liga BetPlay', buscar: 'Colombian Primera A', pais: 'Colombia', icono: '🇨🇴', prioridad: 1 },
  { slug: 'uefa.champions', nombre: 'Champions League', buscar: 'UEFA Champions League', pais: 'Europa', icono: '⭐', prioridad: 2 },
  { slug: 'conmebol.libertadores', nombre: 'Copa Libertadores', buscar: 'Copa Libertadores', pais: 'Sudamérica', icono: '🥇', prioridad: 3 },
  { slug: 'conmebol.sudamericana', nombre: 'Copa Sudamericana', buscar: 'Copa Sudamericana', pais: 'Sudamérica', icono: '🏆', prioridad: 4 },
  { slug: 'eng.1', nombre: 'Premier League', buscar: 'English Premier League', pais: 'Inglaterra', icono: '🏴', prioridad: 5 },
  { slug: 'esp.1', nombre: 'LaLiga', buscar: 'Spanish La Liga', pais: 'España', icono: '🇪🇸', prioridad: 6 },
  { slug: 'ita.1', nombre: 'Serie A', buscar: 'Italian Serie A', pais: 'Italia', icono: '🇮🇹', prioridad: 10 },
];

// Caché del descubrimiento de ligas: el catálogo cambia muy poco y no tiene
// sentido pedirlo en cada sincronización.
let catalogo = null;
let catalogoEn = 0;
const CATALOGO_TTL_MS = 6 * 60 * 60 * 1000;

async function obtenerCatalogo() {
  if (catalogo && Date.now() - catalogoEn < CATALOGO_TTL_MS) return catalogo;
  const datos = await getJson(`${BASE}/all_leagues.php`, { source: 'thesportsdb:catalogo' });
  catalogo = (datos.leagues || []).filter((l) => (l.strSport || '').toLowerCase() === 'soccer');
  catalogoEn = Date.now();
  return catalogo;
}

async function idDeLiga(meta) {
  const ligas = await obtenerCatalogo();
  const objetivo = meta.buscar.toLowerCase();
  const exacta = ligas.find((l) => (l.strLeague || '').toLowerCase() === objetivo);
  if (exacta) return { id: exacta.idLeague, nombreProveedor: exacta.strLeague };
  const parcial = ligas.find((l) => (l.strLeague || '').toLowerCase().includes(objetivo));
  return parcial ? { id: parcial.idLeague, nombreProveedor: parcial.strLeague } : null;
}

/** "1" / "2" -> número; null si no hay marcador todavía. */
function tanteo(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function estadoDe(evento, ahora = Date.now()) {
  const estado = (evento.strStatus || '').toLowerCase();
  if (/ft|finished|aet|pen|match finished/.test(estado)) return 'finished';
  if (/1h|2h|ht|live|in play/.test(estado)) return 'live';

  // Sin estado utilizable se deduce de la hora y del marcador.
  const inicio = new Date(`${evento.dateEvent}T${evento.strTime || '00:00:00'}Z`).getTime();
  if (!Number.isFinite(inicio)) return 'scheduled';
  if (inicio > ahora) return 'scheduled';
  const TRES_HORAS = 3 * 60 * 60 * 1000;
  if (ahora - inicio > TRES_HORAS) return 'finished';
  return tanteo(evento.intHomeScore) !== null ? 'live' : 'scheduled';
}

function equipoDe(nombre, id, escudo) {
  if (!nombre) return null;
  return {
    externalId: id != null ? String(id) : null,
    nombre,
    nombreCorto: nombre,
    iniciales: (nombre.replace(/[^A-Za-zÀ-ÿ]/g, '') || '???').slice(0, 3).toUpperCase(),
    color: null,
    escudo: escudo || null,
  };
}

function normalizarPartido(e, competicionMeta) {
  const local = equipoDe(e.strHomeTeam, e.idHomeTeam, e.strHomeTeamBadge);
  const visitante = equipoDe(e.strAwayTeam, e.idAwayTeam, e.strAwayTeamBadge);
  if (!local || !visitante || !e.dateEvent) return null;

  const estado = estadoDe(e);
  const fechaIso = `${e.dateEvent}T${e.strTime || '00:00:00'}Z`;
  const startsAt = new Date(fechaIso);
  if (Number.isNaN(startsAt.getTime())) return null;

  return {
    externalId: String(e.idEvent),
    fuente: 'thesportsdb',
    competicion: competicionMeta,
    startsAt,
    estado,
    // El proveedor no publica minuto de juego fiable: se deja vacío en lugar
    // de estimarlo.
    minuto: null,
    marcadorLocal: estado === 'scheduled' ? null : tanteo(e.intHomeScore),
    marcadorVisitante: estado === 'scheduled' ? null : tanteo(e.intAwayScore),
    estadio: e.strVenue || '',
    equipoLocal: local,
    equipoVisitante: visitante,
    eventos: [],
  };
}

/**
 * Próximos encuentros y últimos resultados de una competición.
 * Son dos llamadas distintas en este proveedor.
 */
async function obtenerPartidos(slug) {
  const meta = COMPETICIONES.find((c) => c.slug === slug);
  if (!meta) throw new Error(`Competición desconocida para TheSportsDB: ${slug}`);

  const liga = await idDeLiga(meta);
  if (!liga) {
    const err = new Error(`TheSportsDB no tiene la competición "${meta.buscar}"`);
    err.source = 'thesportsdb';
    throw err;
  }

  const competicion = { ...meta, nombreProveedor: liga.nombreProveedor, temporada: '' };
  const partidos = [];

  for (const ruta of ['eventsnextleague', 'eventspastleague']) {
    try {
      const d = await getJson(`${BASE}/${ruta}.php?id=${liga.id}`, { source: `thesportsdb:${ruta}` });
      const lista = d.events || d.results || [];
      for (const e of lista) {
        const p = normalizarPartido(e, competicion);
        if (p) partidos.push(p);
      }
    } catch (e) {
      // Una de las dos listas puede faltar; con la otra ya hay algo que mostrar.
    }
  }

  // Un mismo encuentro puede venir en las dos listas.
  const vistos = new Set();
  const unicos = partidos.filter((p) => (vistos.has(p.externalId) ? false : vistos.add(p.externalId)));

  return { competicion, partidos: unicos, descartados: partidos.length - unicos.length };
}

async function probarCobertura() {
  const resultado = [];
  for (const meta of COMPETICIONES) {
    try {
      const { competicion, partidos } = await obtenerPartidos(meta.slug);
      resultado.push({
        slug: meta.slug,
        nombre: meta.nombre,
        disponible: partidos.length > 0,
        nombreProveedor: competicion.nombreProveedor,
        temporada: competicion.temporada,
        partidos: partidos.length,
      });
    } catch (e) {
      resultado.push({ slug: meta.slug, nombre: meta.nombre, disponible: false, error: e.message });
    }
  }
  return resultado;
}

module.exports = {
  id: 'thesportsdb',
  etiqueta: 'TheSportsDB (clave pública de prueba)',
  atribucion: 'Datos de TheSportsDB (thesportsdb.com)',
  COMPETICIONES,
  obtenerPartidos,
  probarCobertura,
  _estadoDe: estadoDe,
};
