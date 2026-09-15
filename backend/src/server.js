require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'vokter-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ai', aiRoutes);

// Manejo centralizado de errores no capturados
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 4000;

async function start() {
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
