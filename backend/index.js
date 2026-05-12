require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { GAME_BALANCE } = require('./src/utils/gameBalance');

const app = express();
const server = http.createServer(app);

const { setIo } = require('./src/middleware/socketMiddleware');
const prisma = require('./src/utils/prisma');

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
});

app.use(setIo(io));

const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const lobbyRoutes = require('./src/routes/lobbyRoutes');
const matchRoutes = require('./src/routes/matchRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/lobby', lobbyRoutes);
app.use('/api/match', matchRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Maze Champions Server is running' });
});

// In-memory match state management
const matchStates = {};
const soloChallengeStates = {};

// Solo AI Logic Helper
function startSoloAI(lobbyCode, match, io) {
    if (soloChallengeStates[lobbyCode]) return;

    const spawnPoints = match.map.spawn_points;
    const playerSpawn = spawnPoints[0];
    let furthestSpawn = spawnPoints[0];
    let maxDist = 0;

    spawnPoints.forEach(sp => {
        const dist = Math.sqrt(Math.pow(sp.position_x - playerSpawn.position_x, 2) + Math.pow(sp.position_z - playerSpawn.position_z, 2));
        if (dist > maxDist) {
            maxDist = dist;
            furthestSpawn = sp;
        }
    });

    soloChallengeStates[lobbyCode] = {
        lobbyCode,
        matchId: match.id,
        mode: 'SOLO_CHALLENGE',
        timeLeft: 300,
        boss: {
            id: 'boss_main',
            hp: GAME_BALANCE.solo.boss.hp,
            maxHp: GAME_BALANCE.solo.boss.hp,
            position: [furthestSpawn.position_x, 1.5, furthestSpawn.position_z],
            rotation: [0, 0, 0],
            state: 'PATROL',
            targetPos: null,
            lastAttack: 0
        },
        minions: [],
        lastMinionSpawn: Date.now(),
        active: true
    };

    io.to(`lobby_${lobbyCode}`).emit('boss_spawned', soloChallengeStates[lobbyCode].boss);
    console.log(`Solo Challenge started for lobby ${lobbyCode}. Boss spawned at furthest point.`);

    const aiInterval = setInterval(() => {
        updateSoloChallenge(lobbyCode, io);
    }, 1000);

    soloChallengeStates[lobbyCode].interval = aiInterval;
}

function updateSoloChallenge(lobbyCode, io) {
    const state = soloChallengeStates[lobbyCode];
    if (!state || !state.active) return;

    state.timeLeft -= 1;
    io.to(`lobby_${lobbyCode}`).emit('solo_timer_tick', { timeLeft: state.timeLeft });

    if (state.timeLeft <= 0) {
        finishSoloMatch(lobbyCode, 'SURVIVED', io);
        return;
    }

    const players = matchStates[lobbyCode]?.players;
    if (!players) return;
    const player = Object.values(players)[0];
    if (!player || !player.position) return;

    // Boss AI
    const boss = state.boss;
    const distToPlayer = Math.sqrt(
        Math.pow(boss.position[0] - player.position[0], 2) +
        Math.pow(boss.position[2] - player.position[2], 2)
    );

    if (distToPlayer < GAME_BALANCE.solo.boss.attackRange) {
        boss.state = 'ATTACK';
        const now = Date.now();
        if (now - boss.lastAttack > GAME_BALANCE.solo.boss.cooldownMs) {
            boss.lastAttack = now;
            io.to(`lobby_${lobbyCode}`).emit('enemy_attack', { enemyId: boss.id, targetId: player.userId, damage: GAME_BALANCE.solo.boss.damage });
        }
    } else if (distToPlayer < GAME_BALANCE.solo.boss.detectionRange) {
        boss.state = 'CHASE';
        const dir = [player.position[0] - boss.position[0], player.position[2] - boss.position[2]];
        const len = Math.sqrt(dir[0]**2 + dir[1]**2);
        boss.position[0] += (dir[0] / len) * (GAME_BALANCE.solo.boss.speed / 10); // Update speed for 1s tick
        boss.position[2] += (dir[1] / len) * (GAME_BALANCE.solo.boss.speed / 10);
        boss.rotation[1] = Math.atan2(dir[0], dir[1]);
    } else {
        boss.state = 'PATROL';
        if (!boss.targetPos || Math.sqrt((boss.targetPos[0]-boss.position[0])**2 + (boss.targetPos[2]-boss.position[2])**2) < 1) {
            boss.targetPos = [boss.position[0] + (Math.random()-0.5)*20, 1.5, boss.position[2] + (Math.random()-0.5)*20];
        }
        const dir = [boss.targetPos[0] - boss.position[0], boss.targetPos[2] - boss.position[2]];
        const len = Math.sqrt(dir[0]**2 + dir[1]**2);
        if (len > 0.1) {
            boss.position[0] += (dir[0] / len) * (GAME_BALANCE.solo.boss.speed * 0.05);
            boss.position[2] += (dir[1] / len) * (GAME_BALANCE.solo.boss.speed * 0.05);
        }
    }
    io.to(`lobby_${lobbyCode}`).emit('boss_moved', { position: boss.position, rotation: boss.rotation, state: boss.state });

    // Minion Spawn
    if (Date.now() - state.lastMinionSpawn > GAME_BALANCE.solo.minion.spawnIntervalMs && state.minions.length < GAME_BALANCE.solo.minion.maxActive) {
        state.lastMinionSpawn = Date.now();
        const minion = {
            id: `minion_${Math.random().toString(36).substr(2, 9)}`,
            hp: GAME_BALANCE.solo.minion.hp,
            position: [player.position[0] + (Math.random() > 0.5 ? 15 : -15), 1, player.position[2] + (Math.random() > 0.5 ? 15 : -15)],
            state: 'CHASE'
        };
        state.minions.push(minion);
        io.to(`lobby_${lobbyCode}`).emit('minion_spawned', minion);
    }

    // Minion AI
    state.minions.forEach(minion => {
        const mDist = Math.sqrt((minion.position[0]-player.position[0])**2 + (minion.position[2]-player.position[2])**2);
        if (mDist < GAME_BALANCE.solo.minion.attackRange) {
            const now = Date.now();
            if (!minion.lastAttack || now - minion.lastAttack > GAME_BALANCE.solo.minion.cooldownMs) {
                minion.lastAttack = now;
                io.to(`lobby_${lobbyCode}`).emit('enemy_attack', { enemyId: minion.id, targetId: player.userId, damage: GAME_BALANCE.solo.minion.damage });
            }
        } else {
            const dir = [player.position[0] - minion.position[0], player.position[2] - minion.position[2]];
            const len = Math.sqrt(dir[0]**2 + dir[1]**2);
            minion.position[0] += (dir[0] / len) * (GAME_BALANCE.solo.minion.speed / 10);
            minion.position[2] += (dir[1] / len) * (GAME_BALANCE.solo.minion.speed / 10);
            io.to(`lobby_${lobbyCode}`).emit('minion_moved', { id: minion.id, position: minion.position });
        }
    });
}

async function finishSoloMatch(lobbyCode, reason, io) {
    const state = soloChallengeStates[lobbyCode];
    if (!state || !state.active) return;
    state.active = false;
    clearInterval(state.interval);

    let xp = 0;
    if (reason === 'SURVIVED') xp += GAME_BALANCE.xp.soloSurvival;
    if (reason === 'BOSS_KILLED') xp += GAME_BALANCE.xp.bossKill;
    
    // Database Persistence
    try {
        const players = Object.values(matchStates[lobbyCode]?.players || {});
        if (players.length > 0) {
            const player = players[0];
            const userId = player.userId;

            // Update stats
            await prisma.playerStats.upsert({
                where: { user_id: userId },
                update: { 
                    xp: { increment: xp },
                    total_matches: { increment: 1 },
                    wins: { increment: reason !== 'PLAYER_DIED' ? 1 : 0 },
                    losses: { increment: reason === 'PLAYER_DIED' ? 1 : 0 }
                },
                create: {
                    user_id: userId,
                    xp: xp,
                    total_matches: 1,
                    wins: reason !== 'PLAYER_DIED' ? 1 : 0,
                    losses: reason === 'PLAYER_DIED' ? 1 : 0
                }
            });

            // Update match status
            await prisma.match.update({
                where: { lobby_code: lobbyCode },
                data: { 
                    status: 'FINISHED',
                    ended_at: new Date()
                }
            });

            console.log(`Solo results saved for ${userId}: +${xp} XP`);
        }
    } catch (error) {
        console.error('Failed to save solo results:', error);
    }

    io.to(`lobby_${lobbyCode}`).emit('match_ended', { 
        victory: reason !== 'PLAYER_DIED',
        reason,
        xpEarned: xp 
    });
}

io.on('connection', (socket) => {
    socket.on('join_lobby', async (lobbyCode) => {
        socket.join(`lobby_${lobbyCode}`);
        if (!matchStates[lobbyCode]) matchStates[lobbyCode] = { players: {} };
        try {
            const match = await prisma.match.findUnique({
                where: { lobby_code: lobbyCode },
                include: { match_players: { include: { role: true } }, map: { include: { spawn_points: true } } }
            });
            if (match) {
                match.match_players.forEach(mp => {
                    if (!matchStates[lobbyCode].players[mp.user_id]) {
                        const roleKey = (mp.role?.key || 'warrior').toLowerCase();
                        const roleStats = GAME_BALANCE.roles[roleKey];
                        matchStates[lobbyCode].players[mp.user_id] = {
                            userId: mp.user_id,
                            hp: roleStats ? roleStats.hp : 100,
                            maxHp: roleStats ? roleStats.hp : 100,
                            role: roleKey,
                            team_id: mp.team_id
                        };
                    }
                });
                if (match.status === 'ACTIVE' && match.mode === 'SOLO_CHALLENGE') {
                    startSoloAI(lobbyCode, match, io);
                }
            }
        } catch (error) { console.error(error); }
        socket.emit('match_state_sync', matchStates[lobbyCode]);
    });

    socket.on('enemy_damaged', (data) => {
        const { lobbyCode, enemyId, damage, attackerId } = data;
        const state = soloChallengeStates[lobbyCode];
        if (!state) return;
        if (enemyId === 'boss_main') {
            state.boss.hp -= damage;
            io.to(`lobby_${lobbyCode}`).emit('boss_hp_update', { hp: state.boss.hp, maxHp: state.boss.maxHp });
            if (state.boss.hp <= 0) finishSoloMatch(lobbyCode, 'BOSS_KILLED', io);
        } else {
            const mIdx = state.minions.findIndex(m => m.id === enemyId);
            if (mIdx !== -1) {
                state.minions[mIdx].hp -= damage;
                if (state.minions[mIdx].hp <= 0) {
                    state.minions.splice(mIdx, 1);
                    io.to(`lobby_${lobbyCode}`).emit('minion_dead', { id: enemyId, attackerId });
                } else {
                    io.to(`lobby_${lobbyCode}`).emit('minion_damaged', { id: enemyId, hp: state.minions[mIdx].hp });
                }
            }
        }
    });

    socket.on('player_update', (data) => {
        const { lobbyCode, userId, position, rotation } = data;
        if (matchStates[lobbyCode]) {
            if (!matchStates[lobbyCode].players[userId]) matchStates[lobbyCode].players[userId] = { userId, hp: 100, maxHp: 100 };
            matchStates[lobbyCode].players[userId].position = position;
            matchStates[lobbyCode].players[userId].rotation = rotation;
        }
        // console.log(`Player ${userId} moved to ${position} in lobby ${lobbyCode}`);
        io.to(`lobby_${lobbyCode}`).emit('player_updated', { userId, position, rotation });
    });

    socket.on('player_attack', (data) => {
        const { lobbyCode, ...attackData } = data;
        socket.to(`lobby_${lobbyCode}`).emit('player_attacked', attackData);
    });

    socket.on('fireball_fired', (data) => {
        const { lobbyCode, ...fb } = data;
        io.to(`lobby_${lobbyCode}`).emit('fireball_fired', fb);
    });

    socket.on('player_damaged', async (data) => {
        const { lobbyCode, victimId, attackerId, damage } = data;
        const playerState = matchStates[lobbyCode]?.players[victimId];
        if (!playerState || playerState.hp <= 0) return;
        playerState.hp = Math.max(0, playerState.hp - damage);
        io.to(`lobby_${lobbyCode}`).emit('hp_update', { userId: victimId, hp: playerState.hp, maxHp: playerState.maxHp });
        if (playerState.hp <= 0) {
            const match = await prisma.match.findUnique({ where: { lobby_code: lobbyCode } });
            if (match && match.mode === 'SOLO_CHALLENGE') finishSoloMatch(lobbyCode, 'PLAYER_DIED', io);
            else io.to(`lobby_${lobbyCode}`).emit('player_eliminated', { victimId, attackerId });
        }
    });

    socket.on('player_healed', (data) => {
        const { lobbyCode, victimId, amount } = data;
        const ps = matchStates[lobbyCode]?.players[victimId];
        if (ps && ps.hp > 0) {
            ps.hp = Math.min(ps.maxHp, ps.hp + amount);
            io.to(`lobby_${lobbyCode}`).emit('hp_update', { userId: victimId, hp: ps.hp, maxHp: ps.ps_maxHp });
        }
    });

    socket.on('send_message', (data) => {
        const { lobbyCode, username, message } = data;
        io.to(`lobby_${lobbyCode}`).emit('new_message', { username, message, timestamp: new Date() });
    });

    socket.on('disconnect', () => { console.log('User disconnected:', socket.id); });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
