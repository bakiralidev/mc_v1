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

  // If we use BASE_MAZE_25, each cell is 4 units wide to cover 100x100
  const cellScale = grid?.length > 0 ? 1 : 4;

  return (
    <group>
      {/* Floor - Dark Stone Material */}
      <mesh name="maze_floor" rotation={[-Math.PI / 2, 0, 0]} position={[width / 2 - 0.5, 0, height / 2 - 0.5]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#020617" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Grid Floor texture effect */}
      <gridHelper args={[width, 25, 0x1e293b, 0x0f172a]} position={[width/2-0.5, 0.01, height/2-0.5]} />

      {/* Central Hub Glow */}
      <pointLight position={[width/2, 2, height/2]} intensity={2} color="#3b82f6" distance={20} />

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
