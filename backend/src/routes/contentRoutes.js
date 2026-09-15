const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', contentController.list);
router.get('/:id', contentController.getById);
router.post('/', requireAuth, requireRole('expert'), contentController.create);

module.exports = router;
