require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const { setIo } = require('./src/middleware/socketMiddleware');

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
});

app.use(setIo(io));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const lobbyRoutes = require('./src/routes/lobbyRoutes');
const matchRoutes = require('./src/routes/matchRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/lobby', lobbyRoutes);
app.use('/api/match', matchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Maze Champions Server is running' });
});

const prisma = require('./src/utils/prisma');

// In-memory match state management
const matchStates = {};

// Socket logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_lobby', async (lobbyCode) => {
        socket.join(`lobby_${lobbyCode}`);
        console.log(`User ${socket.id} joined lobby room: ${lobbyCode}`);
        
        // Initialize match state if not exists
        if (!matchStates[lobbyCode]) {
            matchStates[lobbyCode] = { players: {} };
        }

        // Send current match state to the newly joined user
        socket.emit('match_state_sync', matchStates[lobbyCode]);
    });

    // O'yinchi harakati va aylanishini sinxronlash
    socket.on('player_update', (data) => {
        const { lobbyCode, userId, position, rotation } = data;
        
        // Save position in memory for quick access
        if (matchStates[lobbyCode]) {
            if (!matchStates[lobbyCode].players[userId]) {
                matchStates[lobbyCode].players[userId] = { hp: 100 };
            }
            matchStates[lobbyCode].players[userId].position = position;
        }
        
        socket.to(`lobby_${lobbyCode}`).emit('player_updated', { userId, position, rotation });
    });

    // Hujum animatsiyasini sinxronlash
    socket.on('player_attack', (data) => {
        const { lobbyCode, ...attackData } = data;
        socket.to(`lobby_${lobbyCode}`).emit('player_attacked', attackData);
    });

    // Sehrgarning olovli sharini sinxronlash
    socket.on('fireball_fired', (data) => {
        const { lobbyCode, ...fireballData } = data;
        io.to(`lobby_${lobbyCode}`).emit('fireball_fired', fireballData);
    });

    // Zarba va HP sinxronlash (Server-side validation)
    socket.on('player_damaged', async (data) => {
        const { lobbyCode, victimId, attackerId, damage } = data;
        
        if (!matchStates[lobbyCode]) matchStates[lobbyCode] = { players: {} };
        if (!matchStates[lobbyCode].players[victimId]) matchStates[lobbyCode].players[victimId] = { hp: 100 };
        
        const playerState = matchStates[lobbyCode].players[victimId];
        playerState.hp = Math.max(0, playerState.hp - damage);

        console.log(`Match ${lobbyCode}: Player ${victimId} took ${damage} damage. HP: ${playerState.hp}`);

        // Broadcast current HP to everyone
        io.to(`lobby_${lobbyCode}`).emit('hp_update', {
            userId: victimId,
            attackerId,
            hp: playerState.hp,
            damage
        });

        // IF PLAYER DIED
        if (playerState.hp <= 0) {
            console.log(`Match ${lobbyCode}: Player ${victimId} ELIMINATED by ${attackerId}`);
            
            try {
                // Find match in DB
                const match = await prisma.match.findUnique({ where: { lobby_code: lobbyCode } });
                if (match) {
                    // Update MatchPlayer status to DEAD
                    await prisma.matchPlayer.update({
                        where: { match_id_user_id: { match_id: match.id, user_id: victimId } },
                        data: { status: 'DEAD', deaths: { increment: 1 } }
                    });

                    // Update Attacker stats
                    if (attackerId) {
                        await prisma.playerStats.update({
                            where: { user_id: attackerId },
                            data: { kills: { increment: 1 }, xp: { increment: 50 } }
                        });
                    }
                }

                io.to(`lobby_${lobbyCode}`).emit('player_eliminated', { victimId, attackerId });
            } catch (error) {
                console.error('Failed to eliminate player in DB:', error);
            }
        }
    });

    // O'lim holati (Manual fallback if needed)
    socket.on('player_died', async (data) => {
        const { lobbyCode, victimId, attackerId } = data;
        
        // This is handled in player_damaged now, but keeping for safety
        io.to(`lobby_${lobbyCode}`).emit('player_eliminated', { victimId, attackerId });
    });

    // Maxsus qobiliyatlar (Skills)
    socket.on('player_skill', (data) => {
        // data: { lobbyCode, userId, skillKey, params }
        const { lobbyCode, ...skillData } = data;
        socket.to(`lobby_${lobbyCode}`).emit('player_skill_used', skillData);
    });

    // O'yin vaqtini boshqarish (Server-side timer)
    socket.on('start_match_timer', (data) => {
        const { lobbyCode, duration } = data;
        let timeLeft = duration;

        const timerInterval = setInterval(() => {
            timeLeft--;
            io.to(`lobby_${lobbyCode}`).emit('timer_update', { timeLeft });

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                io.to(`lobby_${lobbyCode}`).emit('match_time_up');
            }
        }, 1000);

        // Timer intervalini socket'ga biriktirishimiz mumkin (uzilganda to'xtatish uchun)
        socket.timerInterval = timerInterval;
    });

    // Chat tizimi
    socket.on('send_message', (data) => {
        // data: { lobbyCode, username, message }
        const { lobbyCode, username, message } = data;
        io.to(`lobby_${lobbyCode}`).emit('new_message', {
            username,
            message,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        if (socket.timerInterval) clearInterval(socket.timerInterval);
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
