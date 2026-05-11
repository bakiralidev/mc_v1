'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import socket from '@/utils/socket';
import VoxelCharacter from './VoxelCharacter';
import { GAME_BALANCE } from '@/utils/gameBalance';
import { BASE_MAZE_25 } from '@/utils/mazeLayout';

interface PlayerProps {
  myUserId: string;
  matchId: string;
  initialPos: [number, number, number];
  roleId: string;
}

export default function Player({ myUserId, matchId, initialPos, roleId }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [isMoving, setIsMoving] = useState(false);
  const [animation, setAnimation] = useState('idle');
  const roleStats = useMemo(() => {
    const key = roleId.toLowerCase() as keyof typeof GAME_BALANCE.roles;
    return GAME_BALANCE.roles[key] || GAME_BALANCE.roles.warrior;
  }, [roleId]);

  const [hp, setHp] = useState(roleStats.hp);
  const [maxHp, setMaxHp] = useState(roleStats.hp);

  const hpRatio = useMemo(() => {
    const val = hp / (maxHp || 1);
    return isNaN(val) ? 0 : Math.max(0.001, Math.min(1, val));
  }, [hp, maxHp]);

  const speed = roleStats.speed;

  const lastAttack = useRef(0);

  const handleAttack = (event?: any) => {
    const now = performance.now();
    const cooldown = roleStats.mainAttack.cooldownMs;
    if (now - lastAttack.current < cooldown || hp <= 0) return;

    // Mage special fireball targeting
    if (roleId === 'mage' && event instanceof MouseEvent) {
       console.log("Mage attempting to fire...");
       const raycaster = new THREE.Raycaster();
       const mouse = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
       );
       raycaster.setFromCamera(mouse, camera);
       const intersects = raycaster.intersectObjects(scene.children, true);
       let groundIntersect = intersects.find(i => i.object.name === 'maze_floor');
       
       // Fallback: if no floor named maze_floor, use first intersect that is low to ground
       if (!groundIntersect) groundIntersect = intersects.find(i => i.point.y < 0.5);

       if (groundIntersect) {
          console.log("Ground hit! Firing fireball to:", groundIntersect.point);
          lastAttack.current = now;
          setAnimation('attack');
          setTimeout(() => setAnimation('idle'), 400);

          socket.emit('fireball_fired', {
             lobbyCode: matchId,
             userId: myUserId,
             startPos: [groupRef.current!.position.x, 1.5, groupRef.current!.position.z],
             targetPos: [groundIntersect.point.x, 0.1, groundIntersect.point.z]
          });
          return;
       } else {
          console.warn("Mage attack: No ground intersection found!");
       }
    }

    // Standard Attack for other classes
    lastAttack.current = now;
    setAnimation('attack');
    setTimeout(() => setAnimation('idle'), 300);

    socket.emit('player_attack', { lobbyCode: matchId, userId: myUserId, roleId: roleId });

    // Melee/Heal detection
    scene.traverse((obj) => {
      if (obj.name === 'remote_player') {
        const dist = groupRef.current!.position.distanceTo(obj.position);
        if (dist <= roleStats.mainAttack.range) {
          if (roleId === 'healer') {
            socket.emit('player_healed', {
              lobbyCode: matchId,
              victimId: obj.userData.userId,
              healerId: myUserId,
              amount: roleStats.skill.healAmount // Using healAmount from skill for now or main attack
            });
          } else {
            socket.emit('player_damaged', {
              lobbyCode: matchId,
              victimId: obj.userData.userId,
              attackerId: myUserId,
              damage: roleStats.mainAttack.damage
            });
          }
        }
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: true }));
      if (e.code === 'Space') handleAttack();
    };
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) handleAttack(e);
    };

    const handleHpUpdate = (hpData: any) => {
      if (hpData.userId === myUserId) {
        setHp(hpData.hp);
        setMaxHp(hpData.maxHp);
        if (hpData.hp <= 0) {
           socket.emit('player_died', { lobbyCode: matchId, victimId: myUserId, attackerId: hpData.attackerId });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    socket.on('hp_update', handleHpUpdate);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      socket.off('hp_update', handleHpUpdate);
    };
  }, [roleId, matchId, myUserId, hp]);

  useFrame((state, delta) => {
    if (!groupRef.current || hp <= 0) return;

    const move = new THREE.Vector3(0, 0, 0);
    if (keys['KeyW']) move.z -= 1;
    if (keys['KeyS']) move.z += 1;
    if (keys['KeyA']) move.x -= 1;
    if (keys['KeyD']) move.x += 1;

    setIsMoving(move.length() > 0);

    if (move.length() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      
      const currentPos = groupRef.current.position.clone();
      const nextX = currentPos.x + move.x;
      const nextZ = currentPos.z + move.z;

      const isWall = (x: number, z: number) => {
        const gx = Math.round(x / 4);
        const gz = Math.round(z / 4);
        return BASE_MAZE_25[gz]?.[gx] === 1;
      };

      // Collision with buffer
      const buffer = 0.4;
      let canMoveX = !isWall(nextX + (move.x > 0 ? buffer : -buffer), currentPos.z);
      let canMoveZ = !isWall(currentPos.x, nextZ + (move.z > 0 ? buffer : -buffer));

      if (canMoveX) groupRef.current.position.x = nextX;
      if (canMoveZ) groupRef.current.position.z = nextZ;

      const angle = Math.atan2(move.x, move.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, angle, 0.2);

      socket.emit('player_update', {
        lobbyCode: matchId,
        userId: myUserId,
        roleId: roleId,
        position: [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z],
        rotation: [0, groupRef.current.rotation.y, 0]
      });
    }

    // Camera follow according to loyihadagi_olchamlar.md
    // Camera distance: 6, height: 3.2
    const camConfig = GAME_BALANCE.map; // This should be in player or camera config
    const targetCamPos = new THREE.Vector3(
      groupRef.current.position.x, 
      groupRef.current.position.y + 3.2, 
      groupRef.current.position.z + 6
    );
    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(groupRef.current.position.x, groupRef.current.position.y + 1, groupRef.current.position.z);
  });

  const getRoleColor = () => {
    switch(roleId) {
      case 'warrior': return '#ef4444';
      case 'archer': return '#22c55e';
      case 'healer': return '#3b82f6';
      case 'mage': return '#a855f7';
      default: return '#ffffff';
    }
  };

  return (
    <group ref={groupRef} position={initialPos}>
      <VoxelCharacter roleId={roleId} animation={animation} isMoving={isMoving} />
      
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

      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI/2, 0, 0]}>
         <ringGeometry args={[0.6, 0.7, 32]} />
         <meshBasicMaterial color={getRoleColor()} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <Text position={[0, 2.5, 0]} fontSize={0.25} color="white">
        YOU
      </Text>

      <pointLight position={[0, 1.5, 0]} intensity={1} color={getRoleColor()} distance={5} />
    </group>
  );
}
