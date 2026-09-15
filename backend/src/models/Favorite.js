const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
  tableName: 'favorites',
  timestamps: true,
});

module.exports = Favorite;
