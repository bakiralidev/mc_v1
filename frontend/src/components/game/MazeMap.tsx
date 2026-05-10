'use client';

import { Box, Plane, MeshDistortMaterial, Text } from '@react-three/drei';
import { useMemo } from 'react';

interface MazeMapProps {
  grid: number[][];
  width: number;
  height: number;
}

export default function MazeMap({ grid, width, height }: MazeMapProps) {
  const midX = width / 2;
  const midZ = height / 2;

  // If grid is empty, create a simple perimeter for MVP
  const effectiveGrid = useMemo(() => {
    if (grid?.length > 0) return grid;
    return Array(height).fill(0).map((_, y) => 
      Array(width).fill(0).map((_, x) => (x === 0 || x === width - 1 || y === 0 || y === height - 1 ? 1 : 0))
    );
  }, [grid, width, height]);

  return (
    <group>
      {/* Floor - Dark Stone Material */}
      <mesh name="maze_floor" rotation={[-Math.PI / 2, 0, 0]} position={[width / 2 - 0.5, 0, height / 2 - 0.5]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Grid Floor texture effect */}
      <gridHelper args={[Math.max(width, height), Math.max(width, height), 0x334155, 0x1e293b]} position={[width/2-0.5, 0.02, height/2-0.5]} />

      {/* Central Walls */}
      <mesh position={[width/2 - 0.5, 1.5, height/2 - 0.5]}>
         <boxGeometry args={[width, 3, 0.2]} />
         <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[width/2 - 0.5, 1.5, height/2 - 0.5]} rotation={[0, Math.PI/2, 0]}>
         <boxGeometry args={[height, 3, 0.2]} />
         <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>

      {/* Quadrant Numbers */}
      <Text position={[midX - 3, 0.1, midZ - 3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fbbf24">1</Text>
      <Text position={[midX + 3, 0.1, midZ - 3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fbbf24">2</Text>
      <Text position={[midX - 3, 0.1, midZ + 3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fbbf24">3</Text>
      <Text position={[midX + 3, 0.1, midZ + 3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fbbf24">4</Text>

      {/* Walls - Voxel Style */}
      {effectiveGrid.map((row, z) => 
        row.map((cell, x) => (
          cell === 1 ? (
            <Box 
              key={`${x}-${z}`} 
              position={[x, 1, z]} 
              args={[1, 2, 1]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial 
                color="#334155" 
                roughness={0.8} 
                metalness={0.2}
                emissive="#1e293b"
                emissiveIntensity={0.2}
              />
            </Box>
          ) : cell === 2 ? ( // Special Glowing Crystal Voxel
            <group key={`${x}-${z}`} position={[x, 0.5, z]}>
               <Box args={[0.4, 0.8, 0.4]}>
                  <MeshDistortMaterial 
                    color="#3b82f6" 
                    speed={2} 
                    distort={0.4} 
                    emissive="#3b82f6"
                    emissiveIntensity={2}
                  />
               </Box>
               <pointLight color="#3b82f6" intensity={0.5} distance={3} />
            </group>
          ) : null
        ))
      )}
      
      {/* Ambient Torches */}
      <pointLight position={[2, 2, 2]} intensity={0.8} color="#fbbf24" distance={10} />
      <pointLight position={[width-3, 2, height-3]} intensity={0.8} color="#fbbf24" distance={10} />
    </group>
  );
}
