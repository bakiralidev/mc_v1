const prisma = require('../utils/prisma');
const { generateLobbyCode } = require('../utils/codeGenerator');

// Helper function to notify all players in a lobby
const notifyLobbyUpdate = async (io, lobbyCode) => {
    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: lobbyCode },
            include: {
                map: true,
                task: true,
                teams: true,
                match_players: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar_url: true }
                        },
                        role: true
                    }
                }
            }
        });

        if (match) {
            io.to(`lobby_${lobbyCode}`).emit('lobby_update', match);
        }
    } catch (error) {
        console.error('Failed to notify lobby update:', error);
    }
};

// @desc    Create a new lobby
// @route   POST /api/lobby/create
const createLobby = async (req, res) => {
    try {
        const userId = req.user.id;

        // Default map va taskni olamiz
        const defaultMap = await prisma.map.findFirst({ where: { is_active: true } });
        const defaultTask = await prisma.task.findFirst({ where: { is_active: true } });

        if (!defaultMap || !defaultTask) {
            return res.status(400).json({ message: 'No active maps or tasks found' });
        }

        // Takrorlanmas lobby code generatsiya qilamiz
        let lobbyCode;
        let isUnique = false;
        while (!isUnique) {
            lobbyCode = generateLobbyCode();
            const existing = await prisma.match.findUnique({ where: { lobby_code: lobbyCode } });
            if (!existing) isUnique = true;
        }

        // Match yaratish
        const match = await prisma.match.create({
            data: {
                lobby_code: lobbyCode,
                created_by_user_id: userId,
                map_id: defaultMap.id,
                task_id: defaultTask.id,
                status: 'WAITING',
                seed: `seed_${Math.random().toString(36).substring(7)}`,
                settings: {
                    difficulty: 'normal',
                    time_limit: 300
                },
                // Default 2 ta jamoani yaratamiz
                teams: {
                    create: [
                        { name: 'Team Alpha', color: '#FF0000' },
                        { name: 'Team Beta', color: '#0000FF' }
                    ]
                }
            },
            include: { teams: true }
        });

        // Yaratuvchini match_players jadvaliga qo'shamiz
        await prisma.matchPlayer.create({
            data: {
                match_id: match.id,
                user_id: userId,
                team_id: match.teams[0].id, // Birinchi jamoaga avtomatik qo'shiladi
                status: 'WAITING',
                is_ready: false
            }
        });

        res.status(201).json({
            match_id: match.id,
            lobby_code: match.lobby_code,
            status: match.status
        });
    } catch (error) {
        res.status(500).json({ message: 'Lobby creation failed', error: error.message });
    }
};

// @desc    Join a lobby by code
// @route   POST /api/lobby/join
const joinLobby = async (req, res) => {
    const { code } = req.body;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code },
            include: { 
                match_players: true,
                teams: true
            }
        });

        if (!match) {
            return res.status(404).json({ message: 'Lobby not found' });
        }

        if (match.status !== 'WAITING') {
            return res.status(400).json({ message: 'Match already started or cancelled' });
        }

        if (match.match_players.length >= match.max_players) {
            return res.status(400).json({ message: 'Lobby is full' });
        }

        // User allaqachon lobbi ichida bormi?
        const alreadyIn = match.match_players.find(p => p.user_id === userId);
        if (alreadyIn) {
            return res.status(400).json({ message: 'You are already in this lobby' });
        }

        // O'yinchini kamroq odami bor jamoaga qo'shamiz
        const teamAPlayers = match.match_players.filter(p => p.team_id === match.teams[0].id).length;
        const teamBPlayers = match.match_players.filter(p => p.team_id === match.teams[1].id).length;
        const targetTeamId = teamAPlayers <= teamBPlayers ? match.teams[0].id : match.teams[1].id;

        await prisma.matchPlayer.create({
            data: {
                match_id: match.id,
                user_id: userId,
                team_id: targetTeamId,
                status: 'WAITING'
            }
        });

        // Barchaga xabar beramiz
        notifyLobbyUpdate(req.io, code);

        res.json({
            match_id: match.id,
            lobby_code: match.lobby_code,
            status: match.status
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join lobby', error: error.message });
    }
};

// @desc    Get lobby details
// @route   GET /api/lobby/:code
const getLobbyDetails = async (req, res) => {
    const { code } = req.params;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code },
            include: {
                map: true,
                task: true,
                teams: true,
                match_players: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar_url: true }
                        },
                        role: true
                    }
                }
            }
        });

        if (!match) {
            return res.status(404).json({ message: 'Lobby not found' });
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch lobby details', error: error.message });
    }
};

// @desc    Update player selection (role and team)
// @route   PATCH /api/lobby/:code/select
const updateSelection = async (req, res) => {
    const { code } = req.params;
    const { role_id, team_id } = req.body;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code }
        });

        if (!match) return res.status(404).json({ message: 'Lobby not found' });

        let finalRoleId = undefined;
        if (role_id) {
            const role = await prisma.role.findUnique({
                where: { key: role_id }
            });
            if (role) finalRoleId = role.id;
        }

        await prisma.matchPlayer.updateMany({
            where: {
                match_id: match.id,
                user_id: userId
            },
            data: {
                role_id: finalRoleId,
                team_id: team_id || undefined
            }
        });

        // Barchaga xabar beramiz
        notifyLobbyUpdate(req.io, code);

        res.json({ message: 'Selection updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update selection', error: error.message });
    }
};

// @desc    Toggle ready status
// @route   PATCH /api/lobby/:code/ready
const toggleReady = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code }
        });

        if (!match) return res.status(404).json({ message: 'Lobby not found' });

        const currentPlayer = await prisma.matchPlayer.findFirst({
            where: { match_id: match.id, user_id: userId }
        });

        if (!currentPlayer) return res.status(404).json({ message: 'Player not in lobby' });

        const updatedPlayer = await prisma.matchPlayer.update({
            where: { id: currentPlayer.id },
            data: { is_ready: !currentPlayer.is_ready }
        });

        // Barchaga xabar beramiz
        notifyLobbyUpdate(req.io, code);

        res.json({ is_ready: updatedPlayer.is_ready });
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle ready status', error: error.message });
    }
};


// @desc    Create a new team in lobby
// @route   POST /api/lobby/:code/teams
const createTeam = async (req, res) => {
    const { code } = req.params;
    const { name, color } = req.body;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code },
            include: { teams: true }
        });

        if (!match) return res.status(404).json({ message: 'Lobby not found' });
        
        // Jamoalar soni o'yinchilar sonidan oshib ketmasligi kerak
        if (match.teams.length >= match.max_players) {
            return res.status(400).json({ message: 'Too many teams' });
        }

        const team = await prisma.team.create({
            data: {
                match_id: match.id,
                name: name || `Team ${match.teams.length + 1}`,
                color: color || '#808080'
            }
        });

        // Yaratuvchini yangi jamoaga o'tkazamiz
        await prisma.matchPlayer.updateMany({
            where: { match_id: match.id, user_id: userId },
            data: { team_id: team.id }
        });

        notifyLobbyUpdate(req.io, code);
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create team', error: error.message });
    }
};

// @desc    Join an existing team
// @route   POST /api/lobby/:code/teams/:teamId/join
const joinTeam = async (req, res) => {
    const { code, teamId } = req.params;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code }
        });

        if (!match) return res.status(404).json({ message: 'Lobby not found' });

        await prisma.matchPlayer.updateMany({
            where: { match_id: match.id, user_id: userId },
            data: { team_id: teamId }
        });

        notifyLobbyUpdate(req.io, code);
        res.json({ message: 'Joined team successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join team', error: error.message });
    }
};

// @desc    Leave current team (go solo/unassigned)
// @route   POST /api/lobby/:code/teams/leave
const leaveTeam = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code }
        });

        if (!match) return res.status(404).json({ message: 'Lobby not found' });

        await prisma.matchPlayer.updateMany({
            where: { match_id: match.id, user_id: userId },
            data: { team_id: null }
        });

        notifyLobbyUpdate(req.io, code);
        res.json({ message: 'Left team successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to leave team', error: error.message });
    }
};

// @desc    Start the match
// @route   POST /api/lobby/:code/start
const startMatch = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({
            where: { lobby_code: code },
            include: { 
                match_players: {
                    include: { user: true }
                },
                map: {
                    include: { spawn_points: true }
                }
            }
        });

        if (!match) return res.status(404).json({ message: 'Lobby not found' });

        // 1. Faqat Admin (yaratuvchi) boshlay oladi
        if (match.created_by_user_id !== userId) {
            return res.status(403).json({ message: 'Only lobby creator can start the match' });
        }

        // 2. Kamida 2 ta o'yinchi bo'lishi kerak (MVP sharti)
        if (match.match_players.length < 2) {
            return res.status(400).json({ message: 'At least 2 players required to start' });
        }

        // 3. Hamma "Ready" ekanligini tekshiramiz
        const allReady = match.match_players.every(p => p.is_ready);
        if (!allReady) {
            return res.status(400).json({ message: 'All players must be ready to start' });
        }

        // 4. Match statusini ACTIVE qilamiz
        await prisma.match.update({
            where: { id: match.id },
            data: { status: 'ACTIVE' }
        });

        // 5. O'yinchilarga spawn pointlarni biriktiramiz
        // Har bir o'yinchiga xarita spawn pointlaridan birini beramiz
        const playerStartData = match.match_players.map((player, index) => {
            const spawnPoint = match.map.spawn_points[index % match.map.spawn_points.length];
            return {
                user_id: player.user_id,
                username: player.user.username,
                spawn_point: {
                    x: spawnPoint.position_x,
                    y: spawnPoint.position_y,
                    z: spawnPoint.position_z
                }
            };
        });

        // 6. Socket orqali hamma o'yinchilarni o'yinga o'tkazamiz
        req.io.to(`lobby_${code}`).emit('match_start', {
            match_id: match.id,
            map: match.map,
            players: playerStartData
        });

        // Auto-end match after 5 minutes (300s)
        setTimeout(() => {
            const result = {
                winner_team_id: 'team_alpha',
                is_winner: true,
                xp_earned: 450,
                kills: 0,
                deaths: 0,
                healing: 0,
                team_name: 'Team Alpha',
                match_duration: '05:00'
            };
            req.io.to(`lobby_${code}`).emit('match_ended', result);
            console.log(`Match ${code} automatically ended.`);
        }, 300000);

        res.json({ message: 'Match started successfully', players: playerStartData });
    } catch (error) {
        res.status(500).json({ message: 'Failed to start match', error: error.message });
    }
};

module.exports = {
    createLobby,
    joinLobby,
    getLobbyDetails,
    updateSelection,
    toggleReady,
    createTeam,
    joinTeam,
    leaveTeam,
    startMatch
};
