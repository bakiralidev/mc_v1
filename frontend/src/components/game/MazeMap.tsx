import { Box, MeshDistortMaterial, Text, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { BASE_MAZE_25 } from '@/utils/mazeLayout';

interface MazeMapProps {
  grid: number[][];
  width: number;
  height: number;
}

export default function MazeMap({ grid, width, height }: MazeMapProps) {
  // Use provided grid or our custom high-fidelity one
  const effectiveGrid = useMemo(() => {
    if (grid?.length > 0) return grid;
    return BASE_MAZE_25;
  }, [grid]);

  const cellScale = 4;
  const worldWidth = width * cellScale;
  const worldHeight = height * cellScale;

  return (
    <group>
      {/* Floor - Dark Stone Material */}
      <mesh name="maze_floor" rotation={[-Math.PI / 2, 0, 0]} position={[worldWidth / 2 - cellScale / 2, 0, worldHeight / 2 - cellScale / 2]}>
        <planeGeometry args={[worldWidth, worldHeight]} />
        <meshStandardMaterial color="#020617" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Grid Floor texture effect */}
      <gridHelper args={[worldWidth, 50, 0x1e293b, 0x0f172a]} position={[worldWidth/2 - cellScale/2, 0.01, worldHeight/2 - cellScale/2]} />

      {/* Central Hub Glow */}
      <pointLight position={[worldWidth/2, 2, worldHeight/2]} intensity={2} color="#3b82f6" distance={worldWidth} />

      {/* Walls Rendering */}
      {effectiveGrid.map((row, z) => 
        row.map((cell, x) => {
          const posX = x * cellScale;
          const posZ = z * cellScale;

          if (cell === 1) {
            return (
              <Box 
                key={`${x}-${z}`} 
                position={[posX, 1.5, posZ]} 
                args={[cellScale, 3, cellScale]}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial 
                  color="#1e293b" 
                  roughness={0.9} 
                  metalness={0.1}
                  emissive="#0f172a"
                  emissiveIntensity={0.5}
                />
              </Box>
            );
          } else if (cell === 2) { // Glowing Altars/Crystals from image
            const colors = ["#ef4444", "#3b82f6", "#22c55e", "#fbbf24", "#a855f7"];
            const color = colors[(x + z) % colors.length];
            return (
              <group key={`${x}-${z}`} position={[posX, 0.5, posZ]}>
                 <Box args={[cellScale * 0.4, 2, cellScale * 0.4]}>
                    <MeshDistortMaterial 
                      color={color} 
                      speed={3} 
                      distort={0.3} 
                      emissive={color}
                      emissiveIntensity={2}
                    />
                 </Box>
                 <pointLight color={color} intensity={1} distance={8} />
              </group>
            );
          }
          return null;
        })
      )}
      
      {/* Dynamic Ambient Lights */}
      <ambientLight intensity={0.2} />
    </group>
  );
}
