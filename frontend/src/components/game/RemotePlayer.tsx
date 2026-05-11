'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import VoxelCharacter from './VoxelCharacter';
import socket from '@/utils/socket';

interface RemotePlayerProps {
  data: {
    userId: string;
    username: string;
    roleId: string;
    teamId: string;
    position: [number, number, number];
    rotation: [number, number, number];
  };
  myTeamId: string;
}

export default function RemotePlayer({ data, myTeamId }: RemotePlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animation, setAnimation] = useState('idle');
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);

  const hpRatio = useMemo(() => {
    const val = hp / (maxHp || 1);
    return isNaN(val) ? 0 : Math.max(0.001, Math.min(1, val));
  }, [hp, maxHp]);

  const isTeammate = data.teamId === myTeamId;

  useEffect(() => {
    // Listen for this specific player's attacks
    const handleAttack = (attackData: any) => {
      if (attackData.userId === data.userId) {
        setAnimation('attack');
        setTimeout(() => setAnimation('idle'), 300);
      }
    };

    // Listen for HP updates
    const handleHpUpdate = (hpData: any) => {
      if (hpData.userId === data.userId) {
        // Use the exact HP value from the server
        setHp(hpData.hp);
        if (hpData.maxHp) setMaxHp(hpData.maxHp);
      }
    };

    // Listen for full match state sync (on join/reload)
    const handleSync = (state: any) => {
      if (state?.players?.[data.userId]) {
        setHp(state.players[data.userId].hp);
        if (state.players[data.userId].maxHp) setMaxHp(state.players[data.userId].maxHp);
      }
    };

    socket.on('player_attacked', handleAttack);
    socket.on('hp_update', handleHpUpdate);
    socket.on('match_state_sync', handleSync);

    return () => {
      socket.off('player_attacked', handleAttack);
      socket.off('hp_update', handleHpUpdate);
      socket.off('match_state_sync', handleSync);
    };
  }, [data.userId]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(...data.position), 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, data.rotation[1], 0.1);
    }
  });

  const getRoleColor = () => {
    switch(data.roleId) {
      case 'warrior': return '#ef4444';
      case 'archer': return '#22c55e';
      case 'healer': return '#3b82f6';
      case 'mage': return '#a855f7';
      default: return '#ffffff';
    }
  };

  return (
    <group ref={groupRef} name="remote_player" userData={{ userId: data.userId }}>
      <VoxelCharacter roleId={data.roleId} animation={animation} isMoving={false} />
      
      {/* HP Bar */}
      <group position={[0, 2.2, 0]}>
         <mesh>
            <planeGeometry args={[1, 0.1]} />
            <meshBasicMaterial color="#333" />
         </mesh>
         {hpRatio > 0.001 && (
           <mesh position={[-(1 - hpRatio)/2, 0, 0.01]}>
              <planeGeometry args={[hpRatio, 0.1]} />
              <meshBasicMaterial color={hpRatio > 0.3 ? '#22c55e' : '#ef4444'} />
           </mesh>
         )}
      </group>

      <Text position={[0, 2.5, 0]} fontSize={0.2} color={isTeammate ? "#22c55e" : "#ef4444"}>
        {data.username}
      </Text>

      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI/2, 0, 0]}>
         <ringGeometry args={[0.5, 0.6, 32]} />
         <meshBasicMaterial color={getRoleColor()} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
