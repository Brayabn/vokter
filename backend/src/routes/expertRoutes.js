const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/', contentController.listExperts);
router.get('/:id', contentController.getExpert);

module.exports = router;
