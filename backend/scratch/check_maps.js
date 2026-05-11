require('dotenv').config();
const prisma = require('../src/utils/prisma');

async function checkMaps() {
    try {
        const maps = await prisma.map.findMany({
            include: { spawn_points: true }
        });
        console.log(JSON.stringify(maps, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkMaps();
