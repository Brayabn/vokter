const { config, validateConfig } = require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./models');
const { seedDemoData } = require('./utils/seed');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const aiRoutes = require('./routes/aiRoutes');
const expertRoutes = require('./routes/expertRoutes');

const app = express();

// Render (y la mayoría de PaaS) ponen un proxy delante: sin esto, el rate limit
// vería la IP del proxy para todos los usuarios.
app.set('trust proxy', 1);

// Cabeceras de seguridad HTTP estándar (previene clickjacking, sniffing de MIME, etc.)
app.use(helmet());

// CORS: en producción solo los dominios de la web (CORS_ORIGIN, separados por coma).
// Las peticiones sin cabecera Origin (app móvil nativa, curl) no están sujetas a CORS.
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); // app móvil / herramientas sin navegador
    // Desarrollo sin CORS_ORIGIN: cualquier origen. Producción sin CORS_ORIGIN: ninguno.
    if (config.corsOrigins.length === 0) return callback(null, !config.isProduction);
    return callback(null, config.corsOrigins.includes(origin));
  },
}));

app.use(express.json({ limit: '100kb' })); // límite de tamaño, evita payloads abusivos

// Límite de intentos en endpoints sensibles: previene fuerza bruta sobre login/registro.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máx 20 intentos por IP en la ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check (lo usa Render): verifica también la conexión a la base de datos.
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ status: 'ok', service: 'vokter-backend', database: sequelize.getDialect() });
  } catch (err) {
    return res.status(503).json({ status: 'error', service: 'vokter-backend', database: 'unreachable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/experts', expertRoutes);

// Rutas inexistentes: JSON en vez de la página HTML por defecto de Express.
app.use((req, res) => res.status(404).json({ error: 'Recurso no encontrado.' }));

// Manejo centralizado de errores no capturados (no se filtran stack traces al cliente)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido.' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor.' });
});

async function start() {
  try {
    validateConfig();

    await sequelize.authenticate();
    // sync() crea las tablas que no existan (no altera ni borra las existentes).
    await sequelize.sync();
    console.log(`✅ Base de datos conectada (${sequelize.getDialect()}) y sincronizada.`);

    if (config.seedDemoData) {
      const created = await seedDemoData();
      console.log('🌱 Datos demo verificados. Nuevos registros:', created);
    }

    const server = app.listen(config.port, () => {
      console.log(`🚀 VOKTER backend (${config.nodeEnv}) escuchando en el puerto ${config.port}`);
    });

    // Cierre ordenado cuando la plataforma detiene la instancia.
    process.on('SIGTERM', () => {
      server.close(() => sequelize.close().finally(() => process.exit(0)));
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err.message);
    process.exit(1);
  }
}

start();
