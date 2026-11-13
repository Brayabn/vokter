const { getJson } = require('./httpClient');

/**
 * Proveedor openfootball (https://github.com/openfootball/football.json).
 *
 * Conjunto de datos de FÚTBOL EN DOMINIO PÚBLICO, publicado como archivos JSON
 * en GitHub. No hay clave, ni registro, ni límite de peticiones: se sirve desde
 * raw.githubusercontent.com, que es alcanzable desde Render (a diferencia de
 * ESPN y TheSportsDB, que devuelven 403 a las IPs de centro de datos).
 *
 * LIMITACIÓN QUE HAY QUE TENER PRESENTE: es un conjunto de datos estático que
 * se actualiza por commits de voluntarios, NO un marcador en directo. Sirve
 * para calendario y resultados, nunca para un partido en juego. Por eso este
 * proveedor no devuelve nunca el estado "live": un encuentro sin resultado y
 * con hora pasada se queda en "scheduled" hasta que alguien publique el
 * marcador. Fingir un directo que no existe sería inventar.
 */

const BASE = 'https://raw.githubusercontent.com/openfootball/football.json/master';

// Temporada en curso. Configurable por si el despliegue se adelanta al dataset.
const TEMPORADA = process.env.OPENFOOTBALL_SEASON || '2026-27';

const COMPETICIONES = [
  { slug: 'eng.1', archivo: 'en.1', nombre: 'Premier League', pais: 'Inglaterra', icono: '🏴', prioridad: 5 },
  { slug: 'esp.1', archivo: 'es.1', nombre: 'LaLiga', pais: 'España', icono: '🇪🇸', prioridad: 6 },
  { slug: 'ita.1', archivo: 'it.1', nombre: 'Serie A', pais: 'Italia', icono: '🇮🇹', prioridad: 10 },
  { slug: 'ger.1', archivo: 'de.1', nombre: 'Bundesliga', pais: 'Alemania', icono: '🇩🇪', prioridad: 11 },
  { slug: 'fra.1', archivo: 'fr.1', nombre: 'Ligue 1', pais: 'Francia', icono: '🇫🇷', prioridad: 12 },
  { slug: 'ned.1', archivo: 'nl.1', nombre: 'Eredivisie', pais: 'Países Bajos', icono: '🇳🇱', prioridad: 13 },
  { slug: 'por.1', archivo: 'pt.1', nombre: 'Primeira Liga', pais: 'Portugal', icono: '🇵🇹', prioridad: 14 },
  { slug: 'eng.2', archivo: 'en.2', nombre: 'Championship', pais: 'Inglaterra', icono: '🏴', prioridad: 15 },
];

/**
 * El dataset no trae identificadores: se construye uno estable a partir de la
 * competición, la fecha y los dos equipos. Es determinista, así que volver a
 * sincronizar reconoce el mismo encuentro y lo actualiza en lugar de duplicarlo.
 */
function idExterno(archivo, partido) {
  const limpio = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `of:${archivo}:${partido.date}:${limpio(partido.team1)}-vs-${limpio(partido.team2)}`;
}

function iniciales(nombre) {
  const palabras = String(nombre).replace(/[^A-Za-zÀ-ÿ ]/g, '').split(/\s+/).filter(Boolean);
  if (palabras.length >= 3) return palabras.slice(0, 3).map((p) => p[0]).join('').toUpperCase();
  return (palabras.join('') || '???').slice(0, 3).toUpperCase();
}

function equipoDe(nombre) {
  if (!nombre) return null;
  return {
    // El dataset identifica a los equipos solo por su nombre.
    externalId: null,
    nombre,
    nombreCorto: nombre,
    iniciales: iniciales(nombre),
    color: null,
    escudo: null, // openfootball no publica escudos
  };
}

function normalizarPartido(p, archivo, competicion) {
  if (!p.team1 || !p.team2 || !p.date) return null;

  const hora = p.time && /^\d{1,2}:\d{2}$/.test(p.time) ? p.time : '00:00';
  const startsAt = new Date(`${p.date}T${hora}:00Z`);
  if (Number.isNaN(startsAt.getTime())) return null;

  const ft = p.score && Array.isArray(p.score.ft) ? p.score.ft : null;
  // Solo hay dos estados posibles aquí: o está el resultado publicado, o no.
  const estado = ft ? 'finished' : 'scheduled';

  return {
    externalId: idExterno(archivo, p),
    fuente: 'openfootball',
    competicion,
    startsAt,
    estado,
    minuto: null,
    marcadorLocal: ft ? ft[0] : null,
    marcadorVisitante: ft ? ft[1] : null,
    estadio: '',
    jornada: p.round || '',
    equipoLocal: equipoDe(p.team1),
    equipoVisitante: equipoDe(p.team2),
    eventos: [],
  };
}

async function obtenerPartidos(slug) {
  const meta = COMPETICIONES.find((c) => c.slug === slug);
  if (!meta) throw new Error(`Competición desconocida para openfootball: ${slug}`);

  const datos = await getJson(`${BASE}/${TEMPORADA}/${meta.archivo}.json`, {
    source: `openfootball:${meta.archivo}`,
  });

  const competicion = {
    ...meta,
    nombreProveedor: datos.name || meta.nombre,
    temporada: TEMPORADA,
  };

  const lista = Array.isArray(datos.matches) ? datos.matches : [];
  const partidos = lista.map((p) => normalizarPartido(p, meta.archivo, competicion)).filter(Boolean);

  return { competicion, partidos, descartados: lista.length - partidos.length };
}

async function probarCobertura() {
  const resultado = [];
  for (const meta of COMPETICIONES) {
    try {
      const { competicion, partidos } = await obtenerPartidos(meta.slug);
      const jugados = partidos.filter((p) => p.estado === 'finished').length;
      resultado.push({
        slug: meta.slug,
        nombre: meta.nombre,
        disponible: partidos.length > 0,
        nombreProveedor: competicion.nombreProveedor,
        temporada: competicion.temporada,
        partidos: partidos.length,
        conResultado: jugados,
      });
    } catch (e) {
      resultado.push({ slug: meta.slug, nombre: meta.nombre, disponible: false, error: e.message });
    }
  }
  return resultado;
}

module.exports = {
  id: 'openfootball',
  etiqueta: 'openfootball (dominio público)',
  atribucion: 'Datos de openfootball.org, dominio público',
  // Este proveedor nunca da partidos en directo: la interfaz lo señala.
  enVivo: false,
  COMPETICIONES,
  obtenerPartidos,
  probarCobertura,
  _idExterno: idExterno,
};
