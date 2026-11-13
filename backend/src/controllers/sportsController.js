const { Op } = require('sequelize');
const { League, Team, Match, Market, Odd } = require('../models');
const { parseId } = require('../utils/params');
const { probarTodo, competicionesDeclaradas, PROVEEDORES } = require('../services/sports/sportsProvider');
const { estadoSincronizacion, sincronizarTodo } = require('../services/sports/sportsSyncService');

/**
 * Datos deportivos REALES, traídos de fuentes públicas y guardados en la base.
 *
 * Lo que sale por aquí nunca incluye los encuentros de demostración de la
 * maqueta anterior: se excluyen por `source`. Si una competición no tiene
 * fuente gratuita, no se inventa; se dice que no hay datos.
 */

// Los registros de la maqueta anterior quedan fuera de todas las consultas.
const SOLO_REALES = { source: { [Op.ne]: 'demo' } };

const TEAM_ATTRS = ['id', 'name', 'shortName', 'initials', 'color', 'crestUrl'];

const atribuciones = () => PROVEEDORES.map((p) => ({ fuente: p.id, texto: p.atribucion }));

/** Cada respuesta dice de dónde salen los datos y cuándo se actualizaron. */
function conProcedencia(payload) {
  const sync = estadoSincronizacion();
  return {
    ...payload,
    demo: false,
    actualizadoEn: sync.ultimaSync,
    atribucion: atribuciones(),
  };
}

const includeMatch = () => [
  { model: League, as: 'league' },
  { model: Team, as: 'homeTeam', attributes: TEAM_ATTRS },
  { model: Team, as: 'awayTeam', attributes: TEAM_ATTRS },
];

/** Los eventos se guardan como texto JSON; se devuelven ya convertidos. */
function serializar(m) {
  const plano = m.toJSON();
  if (plano.events) {
    try { plano.events = JSON.parse(plano.events); } catch { plano.events = []; }
  } else {
    plano.events = [];
  }
  return plano;
}

// GET /api/sports/leagues
exports.listLeagues = async (req, res) => {
  try {
    const leagues = await League.findAll({
      where: SOLO_REALES,
      order: [['position', 'ASC'], ['name', 'ASC']],
    });

    // Cuántos partidos tiene cada competición: permite a la interfaz enseñar
    // solo las que de verdad tienen cobertura.
    const conteos = await Match.findAll({
      where: SOLO_REALES,
      attributes: ['leagueId', [Match.sequelize.fn('COUNT', '*'), 'total']],
      group: ['leagueId'],
      raw: true,
    });
    const porLiga = Object.fromEntries(conteos.map((c) => [c.leagueId, Number(c.total)]));

    return res.json(conProcedencia({
      leagues: leagues.map((l) => ({ ...l.toJSON(), partidos: porLiga[l.id] || 0 })),
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar las competiciones.' });
  }
};

/**
 * GET /api/sports/matches
 *   ?scope=live|today|upcoming|results   ?leagueSlug=   ?status=   ?limit=
 */
exports.listMatches = async (req, res) => {
  try {
    const texto = (v) => (typeof v === 'string' ? v.slice(0, 50) : '');
    const scope = texto(req.query.scope);
    const leagueSlug = texto(req.query.leagueSlug);
    const status = texto(req.query.status);
    const limit = Math.min(Number(req.query.limit) || 60, 200);

    const where = { ...SOLO_REALES };
    const ahora = new Date();
    let order = [['startsAt', 'ASC']];

    if (scope === 'live') {
      where.status = 'live';
    } else if (scope === 'today') {
      const inicio = new Date(ahora); inicio.setUTCHours(0, 0, 0, 0);
      const fin = new Date(inicio); fin.setUTCDate(fin.getUTCDate() + 1);
      where.startsAt = { [Op.between]: [inicio, fin] };
    } else if (scope === 'upcoming') {
      where.startsAt = { [Op.gt]: ahora };
      where.status = 'scheduled';
    } else if (scope === 'results') {
      where.status = 'finished';
      order = [['startsAt', 'DESC']];
    } else if (['scheduled', 'live', 'finished'].includes(status)) {
      where.status = status;
      if (status === 'finished') order = [['startsAt', 'DESC']];
    }

    const include = includeMatch();
    if (leagueSlug) include[0].where = { slug: leagueSlug };

    const matches = await Match.findAll({ where, include, order, limit });
    return res.json(conProcedencia({ matches: matches.map(serializar), scope: scope || 'todos' }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar los partidos.' });
  }
};

// GET /api/sports/matches/:id
exports.getMatch = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: 'Partido no encontrado.' });

    const match = await Match.findOne({ where: { id, ...SOLO_REALES }, include: includeMatch() });
    if (!match) return res.status(404).json({ error: 'Partido no encontrado.' });

    // Mercados del encuentro, si los hubiera. Hoy ninguna fuente gratuita y sin
    // clave publica cuotas, así que esto viene vacío y se dice explícitamente.
    const markets = await Market.findAll({
      where: { matchId: id },
      include: [{ model: Odd, as: 'odds' }],
      order: [['position', 'ASC']],
    });

    return res.json(conProcedencia({
      match: serializar(match),
      markets,
      cuotasDisponibles: markets.length > 0,
      motivoSinCuotas: markets.length === 0
        ? 'Ninguna fuente pública y sin registro publica cuotas. VOKTER no las inventa.'
        : null,
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el partido.' });
  }
};

/**
 * GET /api/sports/markets
 * Estado real de los mercados. Se conserva el endpoint y la estructura para que
 * la interfaz no cambie, pero se informa de que no hay cuotas verificables.
 */
exports.listMarkets = async (req, res) => {
  try {
    const total = await Market.count({ include: [{ model: Match, as: 'match', where: SOLO_REALES }] });
    return res.json(conProcedencia({
      markets: [],
      cuotasDisponibles: total > 0,
      motivo:
        'No se han encontrado fuentes de cuotas públicas, gratuitas y sin registro. ' +
        'Antes había cuotas de demostración; se han retirado para no presentarlas como reales.',
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar los mercados.' });
  }
};

/**
 * GET /api/sports/coverage
 * Qué competiciones tienen cobertura real y cuáles no. Es lo que permite a la
 * interfaz ser honesta sobre lo que puede y lo que no puede mostrar.
 */
exports.coverage = async (req, res) => {
  try {
    const conDatos = await League.findAll({ where: SOLO_REALES, attributes: ['slug', 'name', 'source'], raw: true });
    const declaradas = competicionesDeclaradas();

    const cubiertas = new Set(conDatos.map((l) => l.slug.split(':')[1]));
    const sinFuente = [
      { nombre: 'Liga BetPlay', pais: 'Colombia' },
      { nombre: 'Copa BetPlay', pais: 'Colombia' },
      { nombre: 'Copa Libertadores', pais: 'Sudamérica' },
      { nombre: 'Copa Sudamericana', pais: 'Sudamérica' },
      { nombre: 'Champions League', pais: 'Europa' },
      { nombre: 'Mundial 2026', pais: 'Internacional' },
    ].filter((c) => !conDatos.some((l) => l.name.toLowerCase().includes(c.nombre.toLowerCase())));

    return res.json(conProcedencia({
      conCobertura: conDatos,
      declaradas: declaradas.length,
      sinFuenteGratuita: sinFuente,
      nota:
        'Las competiciones sin cobertura no tienen ninguna fuente pública, gratuita y sin ' +
        'registro que las publique y que sea alcanzable desde el servidor.',
      cubiertas: [...cubiertas],
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al consultar la cobertura.' });
  }
};

// GET /api/sports/sync — estado de la sincronización automática
exports.syncStatus = async (req, res) => {
  try {
    const sync = estadoSincronizacion();
    const totales = {
      ligas: await League.count({ where: SOLO_REALES }),
      equipos: await Team.count({ where: SOLO_REALES }),
      partidos: await Match.count({ where: SOLO_REALES }),
      enVivo: await Match.count({ where: { ...SOLO_REALES, status: 'live' } }),
    };
    return res.json({ ...sync, totales, atribucion: atribuciones() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al consultar el estado de sincronización.' });
  }
};

// GET /api/sports/diag — a qué fuentes llega el servidor y qué publican.
// Solo lectura y sin aceptar URLs del cliente: recorre únicamente los
// proveedores configurados, así que no sirve para consultar un sitio arbitrario.
exports.diag = async (req, res) => {
  try {
    const inicio = Date.now();
    const fuentes = await probarTodo();
    return res.json({
      comprobadoEn: new Date().toISOString(),
      msTotal: Date.now() - inicio,
      declaradas: competicionesDeclaradas().length,
      fuentes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al diagnosticar las fuentes deportivas.' });
  }
};

// POST /api/sports/sync — fuerza una sincronización (útil tras un despliegue).
exports.forzarSync = async (req, res) => {
  try {
    const resumen = await sincronizarTodo();
    return res.json({ ok: true, resumen });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al sincronizar.' });
  }
};
