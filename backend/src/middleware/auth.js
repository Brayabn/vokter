const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

/**
 * Verifica el token JWT enviado en el header Authorization: Bearer <token>
 * y adjunta el payload decodificado a req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

/**
 * Middleware factory: restringe el acceso a ciertos roles.
 * Uso: requireRole('expert')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
