const express = require('express');
const router = express.Router();
const { guestLogin, register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/guest', guestLogin);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
