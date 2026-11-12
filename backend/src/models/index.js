const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Content = require('./Content');
const Favorite = require('./Favorite');
const League = require('./League');
const Team = require('./Team');
const Match = require('./Match');
const Market = require('./Market');
const Odd = require('./Odd');

// Un experto (User) publica varios Content
User.hasMany(Content, { foreignKey: 'authorId', as: 'contents' });
Content.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Una categoría agrupa varios Content
Category.hasMany(Content, { foreignKey: 'categoryId', as: 'contents' });
Content.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Favoritos: relación N:M entre User y Content, con tabla intermedia explícita
User.belongsToMany(Content, { through: Favorite, as: 'favoriteContents', foreignKey: 'userId' });
Content.belongsToMany(User, { through: Favorite, as: 'favoritedBy', foreignKey: 'contentId' });

// --- Módulo deportivo (tablas nuevas, no tocan nada de lo anterior) ---

// Una competición agrupa varios partidos
League.hasMany(Match, { foreignKey: 'leagueId', as: 'matches' });
Match.belongsTo(League, { foreignKey: 'leagueId', as: 'league' });

// Cada partido enfrenta a dos equipos. Dos asociaciones al mismo modelo, con
// alias distintos, porque un equipo puede ser local o visitante.
Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });

// Un partido ofrece varios mercados, y cada mercado varias opciones con cuota
Match.hasMany(Market, { foreignKey: 'matchId', as: 'markets' });
Market.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });
Market.hasMany(Odd, { foreignKey: 'marketId', as: 'odds' });
Odd.belongsTo(Market, { foreignKey: 'marketId', as: 'market' });

module.exports = {
  sequelize,
  User, Category, Content, Favorite,
  League, Team, Match, Market, Odd,
};
