const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Content = sequelize.define('Content', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  // tags se guarda como CSV simple, usado por el motor de matching de VOKTER AI
  tags: { type: DataTypes.STRING, defaultValue: '' },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING, defaultValue: '' },
}, {
  tableName: 'contents',
  timestamps: true,
});

module.exports = Content;
