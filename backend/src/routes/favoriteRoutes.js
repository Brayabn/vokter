const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', favoriteController.list);
router.post('/:contentId', favoriteController.add);
router.delete('/:contentId', favoriteController.remove);

module.exports = router;
