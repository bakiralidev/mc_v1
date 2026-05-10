const express = require('express');
const router = express.Router();
const { 
    createLobby, 
    joinLobby, 
    getLobbyDetails, 
    updateSelection, 
    toggleReady,
    createTeam,
    joinTeam,
    leaveTeam,
    startMatch 
} = require('../controllers/lobbyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createLobby);
router.post('/join', protect, joinLobby);
router.get('/:code', protect, getLobbyDetails);
router.patch('/:code/select', protect, updateSelection);
router.patch('/:code/ready', protect, toggleReady);

// Team Management
router.post('/:code/teams', protect, createTeam);
router.post('/:code/teams/:teamId/join', protect, joinTeam);
router.post('/:code/teams/leave', protect, leaveTeam);
router.post('/:code/start', protect, startMatch);

module.exports = router;
