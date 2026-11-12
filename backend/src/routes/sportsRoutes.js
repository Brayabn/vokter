const express = require('express');
const router = express.Router();
const sportsController = require('../controllers/sportsController');

// Módulo deportivo de demostración. Todo es de solo lectura y público: no hay
// apuestas, ni saldo, ni pagos, así que ninguna ruta necesita autenticación.
router.get('/leagues', sportsController.listLeagues);
router.get('/matches', sportsController.listMatches);
router.get('/matches/:id', sportsController.getMatch);
router.get('/markets', sportsController.listMarkets);

module.exports = router;
