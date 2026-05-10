const express = require('express');
const router = express.Router();
const { finishMatch } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/finish', protect, finishMatch);

module.exports = router;
