const { League, Team, Match, Market, Odd } = require('../models');
const { LEAGUES, TEAMS, MATCHES } = require('./sportsData');

/**
 * Siembra el módulo deportivo de DEMOSTRACIÓN.
 *
 * Es idempotente y acotado: usa claves naturales (slug de competición, nombre
 * de equipo, código de encuentro) y solo escribe en las tablas nuevas
 * (leagues, teams, matches, markets, odds). No toca usuarios, catálogo,
 * categorías ni favoritos.
 *
 * Las fechas de los encuentros se vuelven a anclar en cada arranque respecto a
 * la hora actual. Es deliberado: sin eso, la maqueta envejecería y acabaría
 * mostrando como "programados" partidos con fecha pasada. Solo se reanclan
 * filas marcadas `isDemo`, que nadie más produce.
 */
async function seedSportsData() {
  const counts = { leagues: 0, teams: 0, matches: 0, markets: 0, odds: 0, reanchored: 0 };

  const leagueBySlug = {};
  for (const data of LEAGUES) {
    const [league, created] = await League.findOrCreate({
      where: { slug: data.slug },
      defaults: { ...data, isDemo: true },
    });
    leagueBySlug[data.slug] = league;
    if (created) counts.leagues += 1;
  }

  const teamByName = {};
  for (const data of TEAMS) {
    const [team, created] = await Team.findOrCreate({
      where: { name: data.name },
      defaults: { ...data, isDemo: true },
    });
    teamByName[data.name] = team;
    if (created) counts.teams += 1;
  }

  const ahora = Date.now();

  for (const def of MATCHES) {
    const { code, league, home, away, startsInHours, markets, ...resto } = def;
    const startsAt = new Date(ahora + startsInHours * 3600 * 1000);

    const [match, created] = await Match.findOrCreate({
      where: { code },
      defaults: {
        ...resto,
        code,
        startsAt,
        leagueId: leagueBySlug[league].id,
        homeTeamId: teamByName[home].id,
        awayTeamId: teamByName[away].id,
        isDemo: true,
      },
    });

    if (created) {
      counts.matches += 1;
    } else if (match.isDemo) {
      // Reancla la fecha para que la demostración no envejezca. Si alguien
      // marcase un encuentro como no demostrativo, se respeta y no se toca.
      await match.update({ startsAt, status: resto.status, minute: resto.minute ?? null });
      counts.reanchored += 1;
    }

    for (const m of markets) {
      const { odds, ...marketData } = m;
      const [market, marketCreated] = await Market.findOrCreate({
        where: { matchId: match.id, type: marketData.type },
        defaults: { ...marketData, matchId: match.id },
      });
      if (marketCreated) counts.markets += 1;

      for (const [i, o] of odds.entries()) {
        const [, oddCreated] = await Odd.findOrCreate({
          where: { marketId: market.id, label: o.label },
          defaults: { ...o, marketId: market.id, position: o.position ?? i },
        });
        if (oddCreated) counts.odds += 1;
      }
    }
  }

  return counts;
}

module.exports = { seedSportsData };
