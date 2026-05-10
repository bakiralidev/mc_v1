const express = require('express');
const router = express.Router();
const { getGameMeta } = require('../controllers/gameController');

router.get('/meta', getGameMeta);

module.exports = router;
