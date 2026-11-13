const { Op } = require('sequelize');
const { sequelize, League, Team, Match } = require('../../models');
const { PROVEEDORES } = require('./sportsProvider');

/**
 * Sincronización de datos deportivos reales.
 *
 * Trae lo que publican las fuentes públicas y lo guarda en PostgreSQL. El resto
 * del sistema lee siempre de la base: ni la web ni la app hablan nunca con un
 * proveedor externo, así que una fuente caída no rompe las pantallas ni
 * multiplica las peticiones por número de usuarios.
 *
 * Reglas que se respetan aquí:
 *  - Nunca se borra nada. Si una fuente deja de publicar un partido, el que ya
 *    está guardado se queda como estaba, con su fecha de sincronización.
 *  - Los registros reales y los de demostración viven separados por `source` y
 *    no se mezclan jamás.
 *  - Si un dato no viene, se guarda null. No se estima ni se rellena.
 */

// Frecuencias configurables, pensadas para fuentes gratuitas.
const CADA_MS = {
  live: Number(process.env.SYNC_LIVE_MS || 60 * 1000),
  completa: Number(process.env.SYNC_FULL_MS || 30 * 60 * 1000),
};

// Estado en memoria para poder contar qué pasó en la última vuelta.
const estado = {
  ultimaSync: null,
  ultimoError: null,
  enCurso: false,
  resumen: null,
  fuentes: {},
};

async function guardarLiga(competicion, source, t) {
  const slug = `${source}:${competicion.slug}`;
  const [liga] = await League.findOrCreate({
    where: { source, externalId: competicion.slug },
    defaults: {
      name: competicion.nombre,
      slug,
      country: competicion.pais || '',
      icon: competicion.icono || '⚽',
      season: competicion.temporada || '',
      position: competicion.prioridad || 50,
      source,
      externalId: competicion.slug,
      isDemo: false,
      syncedAt: new Date(),
    },
    transaction: t,
  });
  // La temporada y el nombre que publica el proveedor pueden cambiar.
  await liga.update(
    { season: competicion.temporada || liga.season, syncedAt: new Date() },
    { transaction: t }
  );
  return liga;
}

async function guardarEquipo(equipo, source, t, cache) {
  // Sin id del proveedor se usa el nombre: es lo único estable que hay.
  const clave = equipo.externalId || `nombre:${equipo.nombre}`;
  if (cache.has(clave)) return cache.get(clave);

  const [fila] = await Team.findOrCreate({
    where: { source, externalId: clave },
    defaults: {
      name: equipo.nombre,
      shortName: equipo.nombreCorto || equipo.nombre,
      initials: equipo.iniciales || '???',
      color: equipo.color || '#2168FF',
      crestUrl: equipo.escudo || null,
      source,
      externalId: clave,
      isDemo: false,
      syncedAt: new Date(),
    },
    transaction: t,
  });

  // El escudo puede aparecer más tarde; se completa sin pisar lo que ya había.
  if (equipo.escudo && !fila.crestUrl) {
    await fila.update({ crestUrl: equipo.escudo }, { transaction: t });
  }
  cache.set(clave, fila);
  return fila;
}

/**
 * Guarda o actualiza un encuentro. Devuelve 'creado' | 'actualizado' | 'igual'.
 *
 * Solo se escribe si algo cambió de verdad: así `syncedAt` no se mueve en cada
 * vuelta y se ve de un vistazo qué partidos están recibiendo datos nuevos.
 */
async function guardarPartido(p, liga, local, visitante, t) {
  const [fila, creado] = await Match.findOrCreate({
    where: { source: p.fuente, externalId: p.externalId },
    defaults: {
      code: `${p.fuente}:${p.externalId}`,
      startsAt: p.startsAt,
      status: p.estado,
      homeScore: p.marcadorLocal,
      awayScore: p.marcadorVisitante,
      minute: p.minuto,
      stadium: p.estadio || '',
      round: p.jornada || null,
      events: p.eventos && p.eventos.length ? JSON.stringify(p.eventos) : null,
      leagueId: liga.id,
      homeTeamId: local.id,
      awayTeamId: visitante.id,
      source: p.fuente,
      externalId: p.externalId,
      isDemo: false,
      isPopular: false,
      syncedAt: new Date(),
    },
    transaction: t,
  });

  if (creado) return 'creado';

  const eventos = p.eventos && p.eventos.length ? JSON.stringify(p.eventos) : null;
  const cambios = {};
  if (fila.status !== p.estado) cambios.status = p.estado;
  if (fila.homeScore !== p.marcadorLocal) cambios.homeScore = p.marcadorLocal;
  if (fila.awayScore !== p.marcadorVisitante) cambios.awayScore = p.marcadorVisitante;
  if (fila.minute !== p.minuto) cambios.minute = p.minuto;
  if (fila.events !== eventos) cambios.events = eventos;
  if (p.startsAt && fila.startsAt && fila.startsAt.getTime() !== p.startsAt.getTime()) {
    cambios.startsAt = p.startsAt;
  }

  if (Object.keys(cambios).length === 0) return 'igual';

  await fila.update({ ...cambios, syncedAt: new Date() }, { transaction: t });
  return 'actualizado';
}

/** Sincroniza una competición de un proveedor. */
async function sincronizarCompeticion(proveedor, slug) {
  const { competicion, partidos } = await proveedor.obtenerPartidos(slug);
  const cuenta = { creados: 0, actualizados: 0, iguales: 0, partidos: partidos.length };

  // Una transacción por competición: si algo falla a mitad, no queda a medias.
  await sequelize.transaction(async (t) => {
    const liga = await guardarLiga(competicion, proveedor.id, t);
    const cacheEquipos = new Map();

    for (const p of partidos) {
      const local = await guardarEquipo(p.equipoLocal, proveedor.id, t, cacheEquipos);
      const visitante = await guardarEquipo(p.equipoVisitante, proveedor.id, t, cacheEquipos);
      const r = await guardarPartido(p, liga, local, visitante, t);
      if (r === 'creado') cuenta.creados += 1;
      else if (r === 'actualizado') cuenta.actualizados += 1;
      else cuenta.iguales += 1;
    }
  });

  return cuenta;
}

/**
 * Vuelta completa por todas las fuentes y competiciones.
 * Un proveedor caído no detiene a los demás: se anota su error y se sigue.
 */
async function sincronizarTodo() {
  if (estado.enCurso) return estado.resumen;
  estado.enCurso = true;
  const inicio = Date.now();
  const resumen = { proveedores: [], creados: 0, actualizados: 0, errores: 0 };

  try {
    for (const proveedor of PROVEEDORES) {
      const detalle = { proveedor: proveedor.id, competiciones: [], creados: 0, actualizados: 0, errores: 0 };

      for (const comp of proveedor.COMPETICIONES) {
        try {
          const c = await sincronizarCompeticion(proveedor, comp.slug);
          detalle.competiciones.push({ slug: comp.slug, ...c });
          detalle.creados += c.creados;
          detalle.actualizados += c.actualizados;
        } catch (e) {
          detalle.errores += 1;
          detalle.competiciones.push({ slug: comp.slug, error: e.message });
        }
      }

      estado.fuentes[proveedor.id] = {
        ultimaSync: new Date().toISOString(),
        alcanzable: detalle.errores < proveedor.COMPETICIONES.length,
        errores: detalle.errores,
      };
      resumen.proveedores.push(detalle);
      resumen.creados += detalle.creados;
      resumen.actualizados += detalle.actualizados;
      resumen.errores += detalle.errores;
    }

    resumen.ms = Date.now() - inicio;
    estado.ultimaSync = new Date().toISOString();
    estado.resumen = resumen;
    estado.ultimoError = null;
    console.log(`⚽ Sincronización: +${resumen.creados} nuevos, ${resumen.actualizados} actualizados, ${resumen.errores} errores en ${resumen.ms}ms`);
  } catch (e) {
    estado.ultimoError = e.message;
    console.error('⚽ Sincronización fallida:', e.message);
  } finally {
    estado.enCurso = false;
  }

  return estado.resumen;
}

/**
 * Vuelta corta: solo los encuentros que están o deberían estar en juego.
 * Mucho más barata que la completa, para poder repetirla a menudo.
 */
async function sincronizarEnVivo() {
  const ahora = Date.now();
  const desde = new Date(ahora - 4 * 60 * 60 * 1000);
  const hasta = new Date(ahora + 30 * 60 * 1000);

  const enJuego = await Match.count({
    where: { source: { [Op.ne]: 'demo' }, startsAt: { [Op.between]: [desde, hasta] } },
  });

  // Sin partidos en esa ventana no se molesta a ningún proveedor.
  if (enJuego === 0) return { omitida: true, motivo: 'ningún encuentro en juego' };

  // Solo los proveedores que de verdad publican partidos en curso.
  const resumen = { creados: 0, actualizados: 0, errores: 0, proveedores: [] };
  for (const proveedor of PROVEEDORES.filter((p) => p.enVivo !== false)) {
    for (const comp of proveedor.COMPETICIONES) {
      try {
        const c = await sincronizarCompeticion(proveedor, comp.slug);
        resumen.creados += c.creados;
        resumen.actualizados += c.actualizados;
      } catch {
        resumen.errores += 1;
      }
    }
    resumen.proveedores.push(proveedor.id);
  }
  estado.ultimaSync = new Date().toISOString();
  return resumen;
}

let temporizadores = [];

/**
 * Arranca la sincronización periódica. Se llama una sola vez al iniciar el
 * servidor: no depende de que ningún usuario abra la aplicación.
 */
function iniciarSincronizacion() {
  if (process.env.SPORTS_SYNC_ENABLED === 'false') {
    console.log('⚽ Sincronización deportiva desactivada por configuración.');
    return;
  }

  // Primera vuelta en diferido, para no retrasar el arranque ni el health check.
  setTimeout(() => { sincronizarTodo().catch(() => {}); }, 8000);

  temporizadores.push(setInterval(() => { sincronizarTodo().catch(() => {}); }, CADA_MS.completa));
  temporizadores.push(setInterval(() => { sincronizarEnVivo().catch(() => {}); }, CADA_MS.live));

  console.log(`⚽ Sincronización activa: completa cada ${Math.round(CADA_MS.completa / 60000)} min, en vivo cada ${Math.round(CADA_MS.live / 1000)} s.`);
}

function detenerSincronizacion() {
  temporizadores.forEach(clearInterval);
  temporizadores = [];
}

const estadoSincronizacion = () => ({ ...estado, cada: CADA_MS });

module.exports = {
  sincronizarTodo,
  sincronizarEnVivo,
  sincronizarCompeticion,
  iniciarSincronizacion,
  detenerSincronizacion,
  estadoSincronizacion,
};
