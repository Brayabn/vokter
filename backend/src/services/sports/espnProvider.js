const { getJson } = require('./httpClient');

/**
 * Proveedor ESPN.
 *
 * ESPN publica unos endpoints de solo lectura que no piden clave ni registro
 * (los que recoge https://github.com/pseudo-r/Public-ESPN-API). Son NO
 * OFICIALES: ESPN no los documenta ni se compromete a mantenerlos, así que
 * pueden cambiar o desaparecer sin aviso. Por eso todo lo que se lee aquí pasa
 * por comprobaciones y, si algo falta, se devuelve null en lugar de inventarlo.
 *
 * Aquí no se escribe en la base de datos: este módulo solo consulta y traduce.
 * De guardar se encarga sportsSyncService.
 */

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

/**
 * Competiciones que nos interesan, con el identificador que usa ESPN.
 * Que estén en esta lista NO significa que ESPN tenga datos: eso se comprueba
 * en ejecución con `probar()` y queda registrado en la tabla de cobertura.
 */
const COMPETICIONES = [
  { slug: 'col.1', nombre: 'Liga BetPlay', pais: 'Colombia', icono: '🇨🇴', prioridad: 1 },
  { slug: 'col.2', nombre: 'Primera B', pais: 'Colombia', icono: '🇨🇴', prioridad: 7 },
  { slug: 'conmebol.libertadores', nombre: 'Copa Libertadores', pais: 'Sudamérica', icono: '🥇', prioridad: 3 },
  { slug: 'conmebol.sudamericana', nombre: 'Copa Sudamericana', pais: 'Sudamérica', icono: '🏆', prioridad: 4 },
  { slug: 'eng.1', nombre: 'Premier League', pais: 'Inglaterra', icono: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', prioridad: 5 },
  { slug: 'esp.1', nombre: 'LaLiga', pais: 'España', icono: '🇪🇸', prioridad: 6 },
  { slug: 'uefa.champions', nombre: 'Champions League', pais: 'Europa', icono: '⭐', prioridad: 2 },
  { slug: 'fifa.world', nombre: 'Mundial', pais: 'Internacional', icono: '🌎', prioridad: 8 },
  { slug: 'fifa.worldq.conmebol', nombre: 'Clasificatorias CONMEBOL', pais: 'Sudamérica', icono: '🌎', prioridad: 9 },
  { slug: 'ita.1', nombre: 'Serie A', pais: 'Italia', icono: '🇮🇹', prioridad: 10 },
  { slug: 'ger.1', nombre: 'Bundesliga', pais: 'Alemania', icono: '🇩🇪', prioridad: 11 },
  { slug: 'usa.1', nombre: 'MLS', pais: 'Estados Unidos', icono: '🇺🇸', prioridad: 12 },
];

// ESPN describe el estado con su propio vocabulario; VOKTER usa tres estados.
function traducirEstado(tipo) {
  const estado = (tipo && tipo.state) || '';
  if (estado === 'in') return 'live';
  if (estado === 'post') return 'finished';
  return 'scheduled';
}

// "45'+2" o "90'" -> 45 / 90. Devuelve null si no se puede leer un número.
function minutoDe(competicion) {
  const reloj = competicion.status && competicion.status.displayClock;
  if (!reloj) return null;
  const m = String(reloj).match(/(\d+)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n >= 0 && n <= 130 ? n : null;
}

function equipoDe(competidor) {
  const t = (competidor && competidor.team) || {};
  return {
    externalId: t.id ? String(t.id) : null,
    nombre: t.displayName || t.name || null,
    nombreCorto: t.shortDisplayName || t.abbreviation || t.name || null,
    iniciales: (t.abbreviation || (t.displayName || '???').slice(0, 3)).toUpperCase().slice(0, 3),
    color: t.color ? `#${String(t.color).replace('#', '')}` : null,
    escudo: t.logo || (Array.isArray(t.logos) && t.logos[0] && t.logos[0].href) || null,
  };
}

/** Marcador: ESPN lo manda como cadena. null si el partido no ha empezado. */
function marcadorDe(competidor, estado) {
  if (estado === 'scheduled') return null;
  const n = Number(competidor && competidor.score);
  return Number.isFinite(n) ? n : null;
}

/** Goles y tarjetas, cuando ESPN los incluye en el scoreboard. */
function eventosDe(competicion) {
  const detalles = Array.isArray(competicion.details) ? competicion.details : [];
  return detalles
    .map((d) => {
      const tipo = (d.type && d.type.text) || '';
      const esGol = d.scoringPlay === true || /goal/i.test(tipo);
      const esTarjeta = /yellow|red card/i.test(tipo);
      if (!esGol && !esTarjeta) return null;
      const jugador = Array.isArray(d.athletesInvolved) && d.athletesInvolved[0];
      return {
        tipo: esGol ? 'gol' : /red/i.test(tipo) ? 'tarjeta-roja' : 'tarjeta-amarilla',
        minuto: d.clock && d.clock.displayValue ? d.clock.displayValue : null,
        jugador: jugador ? jugador.displayName : null,
        equipoExternalId: d.team && d.team.id ? String(d.team.id) : null,
      };
    })
    .filter(Boolean);
}

/**
 * Traduce un evento de ESPN al formato interno de VOKTER.
 * Devuelve null si al partido le faltan los datos mínimos (los dos equipos y
 * la fecha): preferimos descartarlo antes que guardar un registro incompleto.
 */
function normalizarPartido(evento, competicionMeta) {
  const comp = Array.isArray(evento.competitions) && evento.competitions[0];
  if (!comp || !Array.isArray(comp.competitors) || comp.competitors.length < 2) return null;

  const local = comp.competitors.find((c) => c.homeAway === 'home') || comp.competitors[0];
  const visitante = comp.competitors.find((c) => c.homeAway === 'away') || comp.competitors[1];
  const equipoLocal = equipoDe(local);
  const equipoVisitante = equipoDe(visitante);
  if (!equipoLocal.nombre || !equipoVisitante.nombre || !evento.date) return null;

  const estado = traducirEstado(comp.status && comp.status.type);

  return {
    externalId: String(evento.id),
    fuente: 'espn',
    competicion: competicionMeta,
    startsAt: new Date(evento.date),
    estado,
    minuto: estado === 'live' ? minutoDe(comp) : null,
    marcadorLocal: marcadorDe(local, estado),
    marcadorVisitante: marcadorDe(visitante, estado),
    estadio: (comp.venue && comp.venue.fullName) || '',
    equipoLocal,
    equipoVisitante,
    eventos: eventosDe(comp),
  };
}

/**
 * Partidos de una competición. `fecha` opcional en formato YYYYMMDD; sin ella
 * ESPN devuelve la jornada que considera actual.
 */
async function obtenerPartidos(slug, fecha) {
  const meta = COMPETICIONES.find((c) => c.slug === slug);
  if (!meta) throw new Error(`Competición desconocida para ESPN: ${slug}`);

  const url = `${BASE}/${slug}/scoreboard${fecha ? `?dates=${fecha}` : ''}`;
  const datos = await getJson(url, { source: `espn:${slug}` });

  const liga = Array.isArray(datos.leagues) && datos.leagues[0];
  const competicion = {
    ...meta,
    nombreProveedor: liga ? liga.name : meta.nombre,
    temporada: liga && liga.season ? String(liga.season.year) : '',
  };

  const eventos = Array.isArray(datos.events) ? datos.events : [];
  const partidos = eventos.map((e) => normalizarPartido(e, competicion)).filter(Boolean);

  return { competicion, partidos, descartados: eventos.length - partidos.length };
}

/**
 * Comprueba qué competiciones responden de verdad y con cuántos partidos.
 * Es lo que permite decir en la interfaz qué ligas tienen cobertura real en
 * lugar de suponerlo.
 */
async function probarCobertura() {
  const resultado = [];
  for (const meta of COMPETICIONES) {
    try {
      const { competicion, partidos } = await obtenerPartidos(meta.slug);
      resultado.push({
        slug: meta.slug,
        nombre: meta.nombre,
        disponible: true,
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
  id: 'espn',
  etiqueta: 'ESPN (endpoints públicos no oficiales)',
  atribucion: 'Datos deportivos de ESPN',
  COMPETICIONES,
  obtenerPartidos,
  probarCobertura,
  // exportados para las pruebas
  _normalizarPartido: normalizarPartido,
  _traducirEstado: traducirEstado,
};
