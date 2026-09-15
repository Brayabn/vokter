const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('user', 'expert'), defaultValue: 'user' },
  bio: { type: DataTypes.TEXT, defaultValue: '' },
  // skills se guarda como CSV simple: "marketing,estrategia,redes"
  skills: { type: DataTypes.STRING, defaultValue: '' },
  avatarUrl: { type: DataTypes.STRING, defaultValue: '' },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
