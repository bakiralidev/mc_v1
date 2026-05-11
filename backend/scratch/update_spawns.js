require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const map = await prisma.map.findFirst({ where: { name: 'Classic Maze' } });
  if (!map) {
    console.log('Map not found');
    return;
  }

  const newSpawns = [
    { x: 4, z: 4 }, { x: 92, z: 4 }, { x: 4, z: 92 }, { x: 92, z: 92 },
    { x: 48, z: 4 }, { x: 48, z: 92 }, { x: 4, z: 48 }, { x: 92, z: 48 },
    { x: 28, z: 28 }, { x: 68, z: 28 }, { x: 28, z: 68 }, { x: 68, z: 68 }
  ];

  // Delete old spawns
  await prisma.mapSpawnPoint.deleteMany({ where: { map_id: map.id } });

  // Create new spawns
  for (let i = 0; i < newSpawns.length; i++) {
    await prisma.mapSpawnPoint.create({
      data: {
        map_id: map.id,
        name: `Spawn ${i + 1}`,
        position_x: newSpawns[i].x,
        position_y: 0,
        position_z: newSpawns[i].z,
        order_index: i + 1
      }
    });
  }

  console.log('Spawn points updated for new maze layout.');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
