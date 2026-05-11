'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import VoxelCharacter from './VoxelCharacter';
import socket from '@/utils/socket';
import { GAME_BALANCE } from '@/utils/gameBalance';

interface BossProps {
  data: {
    id: string;
    hp: number;
    maxHp: number;
    position: [number, number, number];
    rotation: [number, number, number];
    state: string;
  };
}

export default function Boss({ data }: BossProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animation, setAnimation] = useState('idle');
  const [hp, setHp] = useState(data.hp);
  const maxHp = GAME_BALANCE.solo.boss.hp;

  useEffect(() => {
    const handleHpUpdate = (hpData: any) => {
      setHp(hpData.hp);
    };

    const handleAttack = (attackData: any) => {
      if (attackData.enemyId === 'boss_main') {
        setAnimation('attack');
        setTimeout(() => setAnimation('idle'), 500);
      }
    };

    socket.on('boss_hp_update', handleHpUpdate);
    socket.on('enemy_attack', handleAttack);

    return () => {
      socket.off('boss_hp_update', handleHpUpdate);
      socket.off('enemy_attack', handleAttack);
    };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(...data.position), 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, data.rotation[1], 0.1);
    }
  });

  const hpRatio = Math.max(0, hp / maxHp);

  return (
    <group ref={groupRef} name="boss" userData={{ enemyId: 'boss_main' }}>
      <group scale={[3, 3, 3]}>
        <VoxelCharacter roleId="warrior" animation={animation} isMoving={data.state === 'CHASE' || data.state === 'PATROL'} />
      </group>
      
      {/* HP Bar */}
      <group position={[0, 6, 0]}>
         <mesh>
            <planeGeometry args={[4, 0.3]} />
            <meshBasicMaterial color="#000" />
         </mesh>
         {hpRatio > 0 && (
           <mesh position={[-(4 - (4 * hpRatio))/2, 0, 0.01]}>
              <planeGeometry args={[4 * hpRatio, 0.3]} />
              <meshBasicMaterial color="#ef4444" />
           </mesh>
         )}
      </group>

      <Text position={[0, 7, 0]} fontSize={0.8} color="#ef4444" font="/fonts/Inter-Black.woff">
        THE BOSS
      </Text>

      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI/2, 0, 0]}>
         <ringGeometry args={[2, 2.5, 32]} />
         <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
