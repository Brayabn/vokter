const { League, Team, Match, Market, Odd } = require('../models');
const { MARKET_TYPES, DEMO_NOTICE } = require('../utils/sportsData');
const { parseId } = require('../utils/params');

// Toda respuesta deportiva lleva el aviso: los datos son de demostración y no
// deben presentarse como información verificada en ninguna pantalla.
const conAviso = (payload) => ({ ...payload, demo: true, notice: DEMO_NOTICE });

const TEAM_ATTRIBUTES = ['id', 'name', 'shortName', 'initials', 'color', 'country'];

// Un encuentro siempre viaja con su competición, sus dos equipos y, si se pide,
// sus mercados con las cuotas ordenadas.
const includeMatch = (conMercados) => {
  const include = [
    { model: League, as: 'league' },
    { model: Team, as: 'homeTeam', attributes: TEAM_ATTRIBUTES },
    { model: Team, as: 'awayTeam', attributes: TEAM_ATTRIBUTES },
  ];
  if (conMercados) {
    include.push({ model: Market, as: 'markets', include: [{ model: Odd, as: 'odds' }] });
  }
  return include;
};

const ordenMatch = (conMercados) => {
  const order = [['startsAt', 'ASC']];
  if (conMercados) {
    order.push(
      [{ model: Market, as: 'markets' }, 'position', 'ASC'],
      [{ model: Market, as: 'markets' }, { model: Odd, as: 'odds' }, 'position', 'ASC']
    );
  }
  return order;
};

// GET /api/sports/leagues
exports.listLeagues = async (req, res) => {
  try {
    const leagues = await League.findAll({ order: [['position', 'ASC'], ['name', 'ASC']] });
    return res.json(conAviso({ leagues }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar las competiciones.' });
  }
};

// GET /api/sports/matches?leagueSlug=&status=&popular=true
exports.listMatches = async (req, res) => {
  try {
    const asText = (v) => (typeof v === 'string' ? v.slice(0, 50) : '');
    const leagueSlug = asText(req.query.leagueSlug);
    const status = asText(req.query.status);
    const popular = req.query.popular === 'true';

    const where = {};
    if (['scheduled', 'live', 'finished'].includes(status)) where.status = status;
    if (popular) where.isPopular = true;

    const include = includeMatch(true);
    if (leagueSlug) include[0].where = { slug: leagueSlug };

    const matches = await Match.findAll({ where, include, order: ordenMatch(true) });
    return res.json(conAviso({ matches }));
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

    const match = await Match.findByPk(id, { include: includeMatch(true), order: ordenMatch(true) });
    if (!match) return res.status(404).json({ error: 'Partido no encontrado.' });

    return res.json(conAviso({ match }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el partido.' });
  }
};

// GET /api/sports/markets
// Catálogo de tipos de mercado, con cuántos encuentros ofrecen cada uno y un
// ejemplo real tomado de la base: así la pantalla de mercados no inventa nada.
exports.listMarkets = async (req, res) => {
  try {
    const existentes = await Market.findAll({
      include: [
        { model: Odd, as: 'odds' },
        { model: Match, as: 'match', include: includeMatch(false) },
      ],
      order: [['position', 'ASC'], [{ model: Odd, as: 'odds' }, 'position', 'ASC']],
    });

    const markets = MARKET_TYPES.map((tipo) => {
      const delTipo = existentes.filter((m) => m.type === tipo.type);
      const ejemplo = delTipo.find((m) => m.match) || null;
      return {
        ...tipo,
        disponibles: delTipo.length,
        // Ejemplo tomado de un encuentro real de la base, no inventado aquí.
        ejemplo: ejemplo
          ? {
              matchId: ejemplo.match.id,
              league: ejemplo.match.league?.name,
              homeTeam: ejemplo.match.homeTeam?.shortName || ejemplo.match.homeTeam?.name,
              awayTeam: ejemplo.match.awayTeam?.shortName || ejemplo.match.awayTeam?.name,
              odds: ejemplo.odds.map((o) => ({ label: o.label, description: o.description, value: o.value })),
            }
          : null,
      };
    });

    return res.json(conAviso({ markets }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar los mercados.' });
  }
};
