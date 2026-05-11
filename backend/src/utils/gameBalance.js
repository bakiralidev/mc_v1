/**
 * Maze Champions MVP — Gameplay Balance v0.1
 * Based on docs/loyihadagi_olchamlar.md
 */

const GAME_BALANCE = {
  map: {
    width: 100,
    height: 100,
    wallHeight: 3,
    wallThickness: 1,
    corridorWidth: 4,
    spawnProtectionSeconds: 3,
    maxMatchDurationSeconds: 480, // 8 minut
  },

  player: {
    colliderRadius: 0.45,
    colliderHeight: 1.8,
    mainAttackGlobalCooldownMs: 300,
  },

  roles: {
    warrior: {
      hp: 120,
      speed: 5.0,
      mainAttack: {
        type: "melee",
        damage: 25,
        range: 2.2,
        angle: 90,
        cooldownMs: 900,
        windupMs: 180,
      },
      skill: {
        key: "dash",
        distance: 6,
        durationMs: 250,
        cooldownMs: 5000,
        damage: 0,
      },
    },

    archer: {
      hp: 90,
      speed: 5.8,
      mainAttack: {
        type: "projectile",
        damage: 20,
        range: 18,
        projectileSpeed: 30,
        projectileRadius: 0.18,
        cooldownMs: 1100,
        drawMs: 350,
      },
      skill: {
        key: "long_shot",
        damage: 32,
        range: 28,
        projectileSpeed: 38,
        projectileRadius: 0.16,
        cooldownMs: 6000,
        drawMs: 550,
      },
    },

    healer: {
      hp: 100,
      speed: 5.3,
      mainAttack: {
        type: "projectile",
        damage: 10,
        range: 7,
        projectileSpeed: 20,
        projectileRadius: 0.2,
        cooldownMs: 1000,
      },
      skill: {
        key: "heal",
        healAmount: 25,
        range: 8,
        cooldownMs: 8000,
        castMs: 400,
      },
    },

    mage: {
      hp: 80,
      speed: 4.9,
      mainAttack: {
        type: "projectile",
        damage: 30,
        range: 12,
        projectileSpeed: 18,
        projectileRadius: 0.35,
        cooldownMs: 1400,
        castMs: 350,
      },
      skill: {
        key: "area_blast",
        damage: 22,
        radius: 5,
        cooldownMs: 10000,
        castMs: 600,
      },
    },
  },

  solo: {
    boss: {
      hp: 300,
      damage: 18,
      attackRange: 3.5,
      cooldownMs: 1800,
      speed: 3.2,
      detectionRange: 20,
      scale: 3
    },
    minion: {
      hp: 30,
      damage: 1,
      attackRange: 2.0,
      cooldownMs: 800,
      speed: 4.2,
      detectionRange: 14,
      spawnIntervalMs: 25000,
      maxActive: 6
    }
  },

  xp: {
    kill: 10,
    assist: 5,
    damagePerXp: 100,
    healPerXp: 100,
    survivalPerMinute: 3, // Update as per user request
    bossKill: 100,
    soloSurvival: 60,
    minionKill: 2,
    winnerObjective: 20,
    teamRewardTotal: 100,
  }
};

module.exports = { GAME_BALANCE };
