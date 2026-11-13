const { getJson } = require('./httpClient');

/**
 * Proveedor OpenLigaDB (https://api.openligadb.de).
 *
 * Es público, sin clave y sin registro. Pide atribución, que VOKTER muestra
 * junto a los datos.
 *
 * AVISO IMPORTANTE sobre su contenido: OpenLigaDB es COLABORATIVA. Cualquiera
 * puede dar de alta una competición, y en su listado conviven las ligas
 * alemanas oficiales con entradas de prueba de otros usuarios ("TestLiga",
 * "DebugLiga", "BastardLeague"...) y con copias no oficiales de competiciones
 * extranjeras. Esas copias no están mantenidas de forma fiable.
 *
 * Por eso aquí solo se consumen las competiciones alemanas, que son las que el
 * proyecto mantiene de verdad. Tomar de aquí una "Premier League" creada por un
 * usuario cualquiera sería presentar datos sin verificar como resultados
 * reales, que es justo lo que no queremos.
 */

const BASE = 'https://api.openligadb.de';

const COMPETICIONES = [
  { slug: 'bl1', nombre: 'Bundesliga', pais: 'Alemania', icono: '🇩🇪', prioridad: 20 },
  { slug: 'bl2', nombre: '2. Bundesliga', pais: 'Alemania', icono: '🇩🇪', prioridad: 21 },
  { slug: 'bl3', nombre: '3. Liga', pais: 'Alemania', icono: '🇩🇪', prioridad: 22 },
  { slug: 'dfb', nombre: 'DFB-Pokal', pais: 'Alemania', icono: '🏆', prioridad: 23 },
];

/** Resultado final si existe; si no, el parcial; si no, nada. */
function marcadorDe(partido) {
  const resultados = Array.isArray(partido.matchResults) ? partido.matchResults : [];
  // resultTypeID 2 = resultado final, 1 = descanso.
  const final = resultados.find((r) => r.resultTypeID === 2) || resultados.find((r) => /endergebnis/i.test(r.resultName || ''));
  const parcial = resultados.find((r) => r.resultTypeID === 1);
  const elegido = final || parcial;
  if (!elegido) return { local: null, visitante: null };
  return {
    local: Number.isFinite(elegido.pointsTeam1) ? elegido.pointsTeam1 : null,
    visitante: Number.isFinite(elegido.pointsTeam2) ? elegido.pointsTeam2 : null,
  };
}

/**
 * OpenLigaDB no publica un estado explícito: solo `matchIsFinished` y la hora.
 * El estado "en juego" se deduce, y por eso NO se inventa un minuto: mostrar un
 * minuto calculado a ojo sería un dato falso. Queda en null y la interfaz
 * enseña "En vivo" sin minuto.
 */
function estadoDe(partido, ahora = Date.now()) {
  if (partido.matchIsFinished) return 'finished';
  const inicio = new Date(partido.matchDateTimeUTC || partido.matchDateTime).getTime();
  if (!Number.isFinite(inicio)) return 'scheduled';
  if (inicio > ahora) return 'scheduled';
  // Ha empezado y no está marcado como terminado. Pasadas ~3 h sin cerrarse,
  // lo más probable es que nadie haya actualizado el dato: no se declara vivo.
  const TRES_HORAS = 3 * 60 * 60 * 1000;
  return ahora - inicio < TRES_HORAS ? 'live' : 'finished';
}

function equipoDe(t) {
  if (!t) return null;
  const nombre = t.teamName || t.shortName;
  if (!nombre) return null;
  return {
    externalId: t.teamId != null ? String(t.teamId) : null,
    nombre,
    nombreCorto: t.shortName || nombre,
    iniciales: (nombre.replace(/[^A-Za-zÀ-ÿ]/g, '') || '???').slice(0, 3).toUpperCase(),
    color: null, // OpenLigaDB no publica color de club
    escudo: t.teamIconUrl || null,
  };
}

function eventosDe(partido) {
  const goles = Array.isArray(partido.goals) ? partido.goals : [];
  return goles
    .filter((g) => g && (g.goalGetterName || g.matchMinute != null))
    .map((g) => ({
      tipo: 'gol',
      minuto: g.matchMinute != null ? `${g.matchMinute}'` : null,
      jugador: g.goalGetterName || null,
      equipoExternalId: null, // el API no dice de qué equipo es el goleador
    }));
}

function normalizarPartido(partido, competicionMeta) {
  const local = equipoDe(partido.team1);
  const visitante = equipoDe(partido.team2);
  const fecha = partido.matchDateTimeUTC || partido.matchDateTime;
  if (!local || !visitante || !fecha) return null;

  const estado = estadoDe(partido);
  const marcador = marcadorDe(partido);

  return {
    externalId: String(partido.matchID),
    fuente: 'openligadb',
    competicion: {
      ...competicionMeta,
      nombreProveedor: partido.leagueName || competicionMeta.nombre,
      temporada: partido.leagueSeason != null ? String(partido.leagueSeason) : '',
    },
    startsAt: new Date(fecha),
    estado,
    minuto: null, // ver estadoDe: no se inventa
    marcadorLocal: estado === 'scheduled' ? null : marcador.local,
    marcadorVisitante: estado === 'scheduled' ? null : marcador.visitante,
    estadio: (partido.location && partido.location.locationStadium) || '',
    equipoLocal: local,
    equipoVisitante: visitante,
    eventos: eventosDe(partido),
    actualizadoEnOrigen: partido.lastUpdateDateTime ? new Date(partido.lastUpdateDateTime) : null,
  };
}

async function obtenerPartidos(slug) {
  const meta = COMPETICIONES.find((c) => c.slug === slug);
  if (!meta) throw new Error(`Competición no permitida para OpenLigaDB: ${slug}`);

  const datos = await getJson(`${BASE}/getmatchdata/${slug}`, { source: `openligadb:${slug}` });
  const lista = Array.isArray(datos) ? datos : [];
  const partidos = lista.map((p) => normalizarPartido(p, meta)).filter(Boolean);
  const competicion = partidos.length
    ? partidos[0].competicion
    : { ...meta, nombreProveedor: meta.nombre, temporada: '' };

  return { competicion, partidos, descartados: lista.length - partidos.length };
}

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
  id: 'openligadb',
  etiqueta: 'OpenLigaDB',
  atribucion: 'Datos de OpenLigaDB (openligadb.de)',
  COMPETICIONES,
  obtenerPartidos,
  probarCobertura,
  _estadoDe: estadoDe,
  _marcadorDe: marcadorDe,
};
