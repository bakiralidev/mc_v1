const prisma = require('../utils/prisma');

// @desc    Finish match and calculate results
// @route   POST /api/match/:id/finish
const finishMatch = async (req, res) => {
    const { id } = req.params;
    const { winningTeamId } = req.body || {};

    try {
        const match = await prisma.match.findUnique({
            where: { id },
            include: { match_players: true }
        });

        if (!match) return res.status(404).json({ message: 'Match not found' });

        // 1. Match statusini FINISHED qilamiz
        await prisma.match.update({
            where: { id },
            data: { 
                status: 'FINISHED',
                winner_team_id: winningTeamId
            }
        });

        const results = [];

        // 2. Har bir o'yinchi uchun statistikani yangilaymiz
        for (const player of match.match_players) {
            const isWinner = player.team_id === winningTeamId;
            
            // XP hisoblash: 50 (ishtirok) + 200 (g'alaba) + (kills allaqachon qo'shilgan deb hisoblaymiz, lekin bu yerda yakuniy tekshiruv qilish ham mumkin)
            let earnedXp = 50 + (isWinner ? 200 : 0);

            const stats = await prisma.playerStats.findUnique({
                where: { user_id: player.user_id }
            });

            if (stats) {
                let newXp = stats.xp + earnedXp;
                let newLevel = stats.level;

                // Level up mantiqi (required_xp = level * level * 100)
                while (newXp >= (newLevel * newLevel * 100)) {
                    // newXp -= (newLevel * newLevel * 100); // Agar XP sarflansa
                    newLevel++;
                }

                const updatedStats = await prisma.playerStats.update({
                    where: { user_id: player.user_id },
                    data: {
                        total_matches: { increment: 1 },
                        wins: isWinner ? { increment: 1 } : undefined,
                        losses: !isWinner ? { increment: 1 } : undefined,
                        xp: newXp,
                        level: newLevel
                    }
                });

                results.push({
                    userId: player.user_id,
                    earnedXp,
                    newLevel,
                    isWinner
                });
            }
        }

        // 3. Socket orqali natijalarni barchaga tarqatamiz
        req.io.to(`lobby_${match.lobby_code}`).emit('match_finished', {
            winnerTeamId,
            results
        });

        res.json({ message: 'Match finished and stats updated', results });
    } catch (error) {
        res.status(500).json({ message: 'Failed to finish match', error: error.message });
    }
};

module.exports = {
    finishMatch
};
