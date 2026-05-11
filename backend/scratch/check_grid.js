require('dotenv').config();
const prisma = require('../src/utils/prisma');

async function checkMapGrid() {
    try {
        const maps = await prisma.map.findMany();
        maps.forEach(m => {
            console.log(`Map: ${m.name}, Grid length: ${m.grid ? m.grid.length : 'NULL'}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkMapGrid();
