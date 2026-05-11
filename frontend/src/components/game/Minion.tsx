'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import VoxelCharacter from './VoxelCharacter';
import socket from '@/utils/socket';
import { GAME_BALANCE } from '@/utils/gameBalance';

interface MinionProps {
  data: {
    id: string;
    hp: number;
    position: [number, number, number];
    state: string;
  };
}

export default function Minion({ data }: MinionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animation, setAnimation] = useState('idle');
  const [hp, setHp] = useState(data.hp);
  const maxHp = GAME_BALANCE.solo.minion.hp;

  useEffect(() => {
    const handleDamaged = (dmgData: any) => {
      if (dmgData.id === data.id) {
        setHp(dmgData.hp);
      }
    };

    const handleAttack = (attackData: any) => {
      if (attackData.enemyId === data.id) {
        setAnimation('attack');
        setTimeout(() => setAnimation('idle'), 300);
      }
    };

    socket.on('minion_damaged', handleDamaged);
    socket.on('enemy_attack', handleAttack);

    return () => {
      socket.off('minion_damaged', handleDamaged);
      socket.off('enemy_attack', handleAttack);
    };
  }, [data.id]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(...data.position), 0.1);
    }
  });

  const hpRatio = Math.max(0, hp / maxHp);

  return (
    <group ref={groupRef} name="minion" userData={{ enemyId: data.id }}>
      <VoxelCharacter roleId="warrior" animation={animation} isMoving={true} />
      
      {/* HP Bar */}
      <group position={[0, 2.2, 0]}>
         <mesh>
            <planeGeometry args={[0.8, 0.08]} />
            <meshBasicMaterial color="#000" />
         </mesh>
         {hpRatio > 0 && (
           <mesh position={[-(0.8 - (0.8 * hpRatio))/2, 0, 0.01]}>
              <planeGeometry args={[0.8 * hpRatio, 0.08]} />
              <meshBasicMaterial color="#991b1b" />
           </mesh>
         )}
      </group>

      <Text position={[0, 2.5, 0]} fontSize={0.2} color="#991b1b">
        MINION
      </Text>
    </group>
  );
}
