// Configuración centralizada: se lee y valida una sola vez al arrancar.
// En producción falla rápido (fail-fast) si falta algo crítico, en lugar de
// arrancar con valores inseguros.
require('dotenv').config();

const DEFAULT_JWT_SECRET = 'cambia_este_valor_por_uno_seguro';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const config = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // PostgreSQL (Neon) si existe; si no, SQLite local para desarrollo.
  databaseUrl: process.env.DATABASE_URL || null,
  // TLS activo por defecto (Neon lo exige); solo se desactiva para un PostgreSQL local de pruebas.
  databaseSsl: process.env.DATABASE_SSL !== 'false',
  dbStorage: process.env.DB_STORAGE || null,
  // Lista separada por comas. Vacío en desarrollo = cualquier origen.
  corsOrigins: (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  // Carga los datos demo al arrancar (idempotente: no duplica).
  seedDemoData: process.env.SEED_DEMO_DATA === 'true',
};

function validateConfig() {
  const errors = [];

  if (isProduction) {
    if (!config.jwtSecret || config.jwtSecret === DEFAULT_JWT_SECRET || config.jwtSecret.length < 32) {
      errors.push('JWT_SECRET debe definirse con al menos 32 caracteres aleatorios.');
    }
    if (!config.databaseUrl) {
      errors.push('DATABASE_URL es obligatoria en producción (los datos deben persistir).');
    }
    if (config.corsOrigins.length === 0) {
      // No bloquea el arranque (la app móvil no usa CORS), pero ningún navegador tendrá acceso
      // hasta definirla: seguro por defecto. Resuelve el orden de despliegue API → web.
      console.warn('⚠️  CORS_ORIGIN vacío en producción: se rechazan todas las peticiones de navegadores.');
    }
  } else if (!config.jwtSecret) {
    // En desarrollo se permite un valor por defecto para que el proyecto arranque sin configurar nada.
    config.jwtSecret = DEFAULT_JWT_SECRET;
    console.warn('⚠️  JWT_SECRET no definido: usando un valor de desarrollo (NO usar en producción).');
  }

  if (errors.length > 0) {
    throw new Error(`Configuración inválida:\n - ${errors.join('\n - ')}`);
  }
}

module.exports = { config, validateConfig };
