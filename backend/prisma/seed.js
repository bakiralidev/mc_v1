require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Prisma 7 uchun Driver Adapter sozlash
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seed boshlandi (Adapter bilan)...');

  // 1. Roles
  const roles = [
    {
      key: 'warrior',
      name: 'Warrior',
      description: 'Yaqin masofada jang qiladigan kuchli hujumchi.',
      base_hp: 120,
      base_damage: 25,
      base_speed: 5.0,
      attack_range: 2.2,
      skill_config: { 
        main_attack: 'melee', 
        skill: 'dash', 
        cooldown: 5,
        main_cooldown: 0.9,
        dash_distance: 6,
        dash_duration: 0.25
      }
    },
    {
      key: 'archer',
      name: 'Archer',
      description: 'Uzoq masofadan hujum qiladigan mergan.',
      base_hp: 90,
      base_damage: 20,
      base_speed: 5.8,
      attack_range: 18.0,
      skill_config: { 
        main_attack: 'projectile', 
        skill: 'long_shot', 
        cooldown: 6,
        main_cooldown: 1.1,
        projectile_speed: 30,
        projectile_radius: 0.18
      }
    },
    {
      key: 'healer',
      name: 'Healer',
      description: 'Jamoani davolashga mo\'ljallangan yordamchi.',
      base_hp: 100,
      base_damage: 10,
      base_speed: 5.3,
      attack_range: 7.0,
      skill_config: { 
        main_attack: 'projectile', 
        skill: 'heal', 
        heal_amount: 25, 
        cooldown: 8,
        main_cooldown: 1.0,
        heal_range: 8
      }
    },
    {
      key: 'mage',
      name: 'Mage',
      description: 'Masofadan skill orqali hujum qiladigan sehrgar.',
      base_hp: 80,
      base_damage: 30,
      base_speed: 4.9,
      attack_range: 12.0,
      skill_config: { 
        main_attack: 'projectile', 
        skill: 'area_blast', 
        cooldown: 10,
        main_cooldown: 1.4,
        projectile_speed: 18,
        projectile_radius: 0.35,
        area_radius: 5
      }
    }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: role,
      create: role
    });
  }
  console.log('Rollar qo\'shildi.');

  // 2. Tasks
  await prisma.task.upsert({
    where: { key: 'survival' },
    update: {},
    create: {
      key: 'survival',
      title: 'Survival',
      description: "Oxirigacha tirik qolgan jamoa g'olib bo'ladi.",
      win_condition: { type: 'last_team_alive' }
    }
  });
  console.log('Vazifa (Task) qo\'shildi.');

  // 3. Map
  let map = await prisma.map.findFirst({
    where: { seed: 'maze_classic_001' }
  });

  if (!map) {
    map = await prisma.map.create({
      data: {
        name: 'Classic Maze',
        description: 'MVP uchun asosiy labirint xarita.',
        seed: 'maze_classic_001',
        width: 100,
        height: 100,
        max_players: 12
      }
    });
    console.log('Xarita (Map) yaratildi.');
  } else {
    console.log('Xarita allaqachon mavjud.');
  }

  // 4. Spawn Points (12 points)
  const spawnPointsCount = await prisma.mapSpawnPoint.count({
    where: { map_id: map.id }
  });

  if (spawnPointsCount === 0) {
    const spawnPoints = [
      { x: 10, z: 10 }, { x: 50, z: 10 }, { x: 90, z: 10 },
      { x: 10, z: 50 }, { x: 50, z: 50 }, { x: 90, z: 50 },
      { x: 10, z: 90 }, { x: 50, z: 90 }, { x: 90, z: 90 },
      { x: 30, z: 30 }, { x: 70, z: 30 }, { x: 30, z: 70 }
    ];

    for (let i = 0; i < spawnPoints.length; i++) {
      await prisma.mapSpawnPoint.create({
        data: {
          map_id: map.id,
          name: `Spawn ${i + 1}`,
          position_x: spawnPoints[i].x,
          position_y: 0,
          position_z: spawnPoints[i].z,
          order_index: i + 1
        }
      });
    }
    console.log('Tug\'ilish nuqtalari (Spawn Points) qo\'shildi.');
  } else {
    console.log('Tug\'ilish nuqtalari allaqachon mavjud.');
  }

  console.log('Seed yakunlandi muvaffaqiyatli!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
