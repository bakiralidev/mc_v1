require('dotenv').config();
const prisma = require('../src/utils/prisma');

// Simple Prim's or Recursive Backtracker could go here, but I'll use a placeholder logic 
// to generate a 25x25 maze grid for the Classic Maze record.
function generateSimpleMaze(w, h) {
    const grid = Array(h).fill(0).map(() => Array(w).fill(1));
    
    function carve(x, y) {
        grid[y][x] = 0;
        // Make 2x2 corridor
        if (x+1 < w) grid[y][x+1] = 0;
        if (y+1 < h) grid[y+1][x] = 0;
        if (x+1 < w && y+1 < h) grid[y+1][x+1] = 0;

        const dirs = [[0,4], [0,-4], [4,0], [-4,0]].sort(() => Math.random() - 0.5);
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && grid[ny][nx] === 1) {
                // Connect the 2x2 blocks
                for(let i=1; i<=Math.abs(dx); i++) {
                    const stepX = x + (dx > 0 ? i : -i);
                    grid[y][stepX] = 0;
                    if (y+1 < h) grid[y+1][stepX] = 0;
                }
                for(let i=1; i<=Math.abs(dy); i++) {
                    const stepY = y + (dy > 0 ? i : -i);
                    grid[stepY][x] = 0;
                    if (x+1 < w) grid[stepY][x+1] = 0;
                }
                carve(nx, ny);
            }
        }
    }
    carve(1, 1);
    return grid;
}

async function updateClassicMaze() {
    try {
        const maze = generateSimpleMaze(51, 51);
        const map = await prisma.map.findFirst({ where: { name: 'Classic Maze' } });
        if (map) {
            await prisma.map.update({
                where: { id: map.id },
                data: { 
                    grid: maze,
                    width: 51,
                    height: 51
                }
            });

            // Delete old spawn points
            await prisma.mapSpawnPoint.deleteMany({ where: { map_id: map.id } });

            // Find valid spawn points (randomly)
            const validPoints = [];
            for(let i=0; i<1000 && validPoints.length < 12; i++) {
                const rx = Math.floor(Math.random() * 51);
                const rz = Math.floor(Math.random() * 51);
                if (maze[rz][rx] === 0) {
                    if (!validPoints.some(p => p.x === rx && p.z === rz)) {
                        validPoints.push({ x: rx, z: rz });
                    }
                }
            }

            // Create new spawn points in DB
            for(const p of validPoints) {
                await prisma.mapSpawnPoint.create({
                    data: {
                        map_id: map.id,
                        name: `Spawn ${validPoints.indexOf(p) + 1}`,
                        position_x: p.x * 4,
                        position_y: 1,
                        position_z: p.z * 4,
                        order_index: validPoints.indexOf(p)
                    }
                });
            }

            console.log('Classic Maze grid and 12 spawn points updated successfully!');
        } else {
            console.log('Classic Maze not found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

updateClassicMaze();
