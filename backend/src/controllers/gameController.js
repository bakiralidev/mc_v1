const prisma = require('../utils/prisma');

// @desc    Get game metadata (roles, maps, tasks)
// @route   GET /api/game/meta
const getGameMeta = async (req, res) => {
    try {
        const [roles, maps, tasks] = await Promise.all([
            prisma.role.findMany({ where: { is_active: true } }),
            prisma.map.findMany({ 
                where: { is_active: true },
                include: { spawn_points: true } 
            }),
            prisma.task.findMany({ where: { is_active: true } })
        ]);

        res.json({
            roles,
            maps,
            tasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch game meta', error: error.message });
    }
};

module.exports = {
    getGameMeta
};
