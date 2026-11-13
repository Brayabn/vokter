const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const sportsController = require('../controllers/sportsController');

// Módulo deportivo. Todo es de solo lectura y público: no hay apuestas, ni
// saldo, ni pagos, así que ninguna consulta necesita autenticación.
router.get('/leagues', sportsController.listLeagues);
router.get('/matches', sportsController.listMatches);
router.get('/matches/:id', sportsController.getMatch);
router.get('/markets', sportsController.listMarkets);
router.get('/coverage', sportsController.coverage);
router.get('/sync', sportsController.syncStatus);
router.get('/diag', sportsController.diag);

// Forzar una sincronización golpea a los proveedores externos, así que va muy
// limitada: es una herramienta de mantenimiento, no una ruta de uso normal.
const limiteSync = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas sincronizaciones seguidas. Espera unos minutos.' },
});
router.post('/sync', limiteSync, sportsController.forzarSync);

module.exports = router;
