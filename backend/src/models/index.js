const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Content = require('./Content');
const Favorite = require('./Favorite');

// Un experto (User) publica varios Content
User.hasMany(Content, { foreignKey: 'authorId', as: 'contents' });
Content.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Una categoría agrupa varios Content
Category.hasMany(Content, { foreignKey: 'categoryId', as: 'contents' });
Content.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Favoritos: relación N:M entre User y Content, con tabla intermedia explícita
User.belongsToMany(Content, { through: Favorite, as: 'favoriteContents', foreignKey: 'userId' });
Content.belongsToMany(User, { through: Favorite, as: 'favoritedBy', foreignKey: 'contentId' });

module.exports = { sequelize, User, Category, Content, Favorite };
