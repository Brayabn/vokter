import api from './client';

/**
 * Módulo deportivo del backend (/api/sports). Todo es de solo lectura.
 *
 * Cada respuesta trae `demo: true` y un `notice`: los datos son de
 * DEMOSTRACIÓN. Las pantallas lo muestran siempre, nunca lo ocultan.
 */

export async function getLeagues() {
  const { data } = await api.get('/sports/leagues');
  return { leagues: data.leagues, notice: data.notice };
}

/** @param {{leagueSlug?: string, status?: string, popular?: boolean}} filtros */
export async function getMatches(filtros = {}) {
  const params = {};
  if (filtros.leagueSlug) params.leagueSlug = filtros.leagueSlug;
  if (filtros.status) params.status = filtros.status;
  if (filtros.popular) params.popular = 'true';
  const { data } = await api.get('/sports/matches', { params });
  return { matches: data.matches, notice: data.notice };
}

export async function getMatch(id) {
  const { data } = await api.get(`/sports/matches/${id}`);
  return { match: data.match, notice: data.notice };
}

export async function getMarkets() {
  const { data } = await api.get('/sports/markets');
  return { markets: data.markets, notice: data.notice };
}

// --- Utilidades de presentación, compartidas por todas las pantallas ---

export const ESTADOS = {
  scheduled: { texto: 'Programado', corto: 'PROG' },
  live: { texto: 'En vivo', corto: 'VIVO' },
  finished: { texto: 'Finalizado', corto: 'FIN' },
};

/** "Hoy 20:30", "Mañana 15:00" o "vie 21 · 18:00" según lo lejos que quede. */
export function formatKickoff(startsAt) {
  const fecha = new Date(startsAt);
  if (Number.isNaN(fecha.getTime())) return '';
  const hora = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });

  const dia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diasDeDiferencia = Math.round((dia(fecha) - dia(new Date())) / 86400000);

  if (diasDeDiferencia === 0) return `Hoy ${hora}`;
  if (diasDeDiferencia === 1) return `Mañana ${hora}`;
  if (diasDeDiferencia === -1) return `Ayer ${hora}`;
  const corta = fecha.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  return `${corta} · ${hora}`;
}

/** La cuota decimal con dos decimales: 1.7 -> "1.70". */
export function formatOdd(value) {
  return Number(value).toFixed(2);
}
