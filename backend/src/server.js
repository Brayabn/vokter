require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const aiRoutes = require('./routes/aiRoutes');
const expertRoutes = require('./routes/expertRoutes');

const app = express();

// Cabeceras de seguridad HTTP estándar (previene clickjacking, sniffing de MIME, etc.)
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
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

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'vokter-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/experts', expertRoutes);

// Manejo centralizado de errores no capturados
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 4000;

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'cambia_este_valor_por_uno_seguro') {
    console.warn('⚠️  JWT_SECRET no ha sido personalizado en .env — cámbialo antes de producción.');
  }

  try {
    await sequelize.authenticate();
    // sync() crea las tablas automáticamente si no existen (ideal para evaluación rápida)
    await sequelize.sync();
    console.log('✅ Base de datos conectada y sincronizada.');

    app.listen(PORT, () => {
      console.log(`🚀 VOKTER backend corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

start();
