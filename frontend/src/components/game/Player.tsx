'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import socket from '@/utils/socket';
import VoxelCharacter from './VoxelCharacter';
import { GAME_BALANCE } from '@/utils/gameBalance';
import { useGameStore } from '@/store/gameStore';

interface PlayerProps {
  myUserId: string;
  matchId: string;
  initialPos: [number, number, number];
  roleId: string;
  grid: number[][];
}

export default function Player({ myUserId, matchId, initialPos, roleId, grid }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, scene, gl } = useThree();
  const cameraMode = useGameStore(state => state.cameraMode);
  const toggleCameraMode = useGameStore(state => state.toggleCameraMode);
  
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [isMoving, setIsMoving] = useState(false);
  const [animation, setAnimation] = useState('idle');
  
  // Camera state
  const cameraRotation = useRef({ x: 0, y: 0 });
  const mouseSensitivity = 0.002;

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
       const raycaster = new THREE.Raycaster();
       const mouse = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
       );
       raycaster.setFromCamera(mouse, camera);
       const intersects = raycaster.intersectObjects(scene.children, true);
       let groundIntersect = intersects.find(i => i.object.name === 'maze_floor');
       if (!groundIntersect) groundIntersect = intersects.find(i => i.point.y < 0.5);

       if (groundIntersect) {
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
       }
    }

    // Standard Attack
    lastAttack.current = now;
    setAnimation('attack');
    setTimeout(() => setAnimation('idle'), 300);

    socket.emit('player_attack', { lobbyCode: matchId, userId: myUserId, roleId: roleId });

    scene.traverse((obj) => {
      if (obj.name === 'remote_player' || obj.name === 'boss' || obj.name === 'minion') {
        const dist = groupRef.current!.position.distanceTo(obj.position);
        if (dist <= roleStats.mainAttack.range) {
          if (obj.name === 'remote_player') {
             socket.emit('player_damaged', {
               lobbyCode: matchId,
               victimId: obj.userData.userId,
               attackerId: myUserId,
               damage: roleStats.mainAttack.damage
             });
          } else {
            socket.emit('enemy_damaged', {
              lobbyCode: matchId,
              enemyId: obj.userData.enemyId,
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
      if (e.code === 'KeyV') toggleCameraMode();
    };
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        handleAttack(e);
        // Only request lock if not already locked
        if (document.pointerLockElement !== gl.domElement) {
          try {
            const promise = gl.domElement.requestPointerLock() as any;
            if (promise && promise.catch) {
              promise.catch((err: any) => {
                if (err.name !== 'SecurityError') {
                  console.warn("Pointer lock request failed:", err);
                }
              });
            }
          } catch (err) {
            console.warn("Pointer lock request sync failed:", err);
          }
        }
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement) {
        cameraRotation.current.y -= e.movementX * mouseSensitivity;
        cameraRotation.current.x -= e.movementY * mouseSensitivity;
        cameraRotation.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, cameraRotation.current.x));
      }
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
    window.addEventListener('mousemove', handleMouseMove);
    socket.on('hp_update', handleHpUpdate);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      socket.off('hp_update', handleHpUpdate);
    };
  }, [roleId, matchId, myUserId, hp, toggleCameraMode, gl]);

  useFrame((state, delta) => {
    if (!groupRef.current || hp <= 0) return;

    const move = new THREE.Vector3(0, 0, 0);
    if (keys['KeyW']) move.z -= 1;
    if (keys['KeyS']) move.z += 1;
    if (keys['KeyA']) move.x -= 1;
    if (keys['KeyD']) move.x += 1;

    setIsMoving(move.length() > 0);

    if (move.length() > 0) {
      move.normalize();
      const yaw = cameraRotation.current.y;
      const rotatedMove = move.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      rotatedMove.multiplyScalar(speed * delta);
      
      const currentPos = groupRef.current.position.clone();
      const nextX = currentPos.x + rotatedMove.x;
      const nextZ = currentPos.z + rotatedMove.z;

      const isWall = (x: number, z: number) => {
        const gx = Math.round(x / 4);
        const gz = Math.round(z / 4);
        if (!grid || !grid[gz]) return false;
        return grid[gz][gx] === 1;
      };

      const buffer = 0.5;
      let canMoveX = true;
      let canMoveZ = true;

      const checkPointsX = [
        { x: nextX + buffer, z: currentPos.z + buffer },
        { x: nextX + buffer, z: currentPos.z - buffer },
        { x: nextX - buffer, z: currentPos.z + buffer },
        { x: nextX - buffer, z: currentPos.z - buffer },
      ];
      if (checkPointsX.some(p => isWall(p.x, p.z))) canMoveX = false;

      const checkPointsZ = [
        { x: currentPos.x + buffer, z: nextZ + buffer },
        { x: currentPos.x + buffer, z: nextZ - buffer },
        { x: currentPos.x - buffer, z: nextZ + buffer },
        { x: currentPos.x - buffer, z: nextZ - buffer },
      ];
      if (checkPointsZ.some(p => isWall(p.x, p.z))) canMoveZ = false;

      if (canMoveX) groupRef.current.position.x = nextX;
      if (canMoveZ) groupRef.current.position.z = nextZ;

      if (cameraMode === 'FIRST_PERSON') {
        groupRef.current.rotation.y = yaw;
      } else {
        const movementAngle = Math.atan2(rotatedMove.x, rotatedMove.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, movementAngle, 0.2);
      }

      socket.emit('player_update', {
        lobbyCode: matchId,
        userId: myUserId,
        roleId: roleId,
        position: [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z],
        rotation: [0, groupRef.current.rotation.y, 0]
      });
    } else if (cameraMode === 'FIRST_PERSON') {
      groupRef.current.rotation.y = cameraRotation.current.y;
    }

    if (cameraMode === 'FIRST_PERSON') {
      camera.position.set(groupRef.current.position.x, groupRef.current.position.y + 1.65, groupRef.current.position.z);
      camera.rotation.set(cameraRotation.current.x, cameraRotation.current.y, 0, 'YXZ');
      camera.fov = 80;
    } else {
      const distance = 6;
      const height = 3.2;
      const idealOffset = new THREE.Vector3(0, height, distance);
      idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.current.y);
      idealOffset.applyAxisAngle(new THREE.Vector3(1, 0, 0), cameraRotation.current.x * 0.5);
      
      const targetPos = groupRef.current.position.clone().add(idealOffset);
      const rayDirection = targetPos.clone().sub(groupRef.current.position).normalize();
      const raycaster = new THREE.Raycaster(groupRef.current.position, rayDirection, 0, distance + 1);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const wallIntersect = intersects.find(i => i.object.name.includes('wall') || i.object.name.includes('maze'));
      
      let finalCamPos = targetPos;
      if (wallIntersect && wallIntersect.distance < distance) {
        finalCamPos = groupRef.current.position.clone().add(rayDirection.multiplyScalar(wallIntersect.distance - 0.5));
      }

      camera.position.lerp(finalCamPos, 0.15);
      camera.lookAt(groupRef.current.position.x, groupRef.current.position.y + 1.2, groupRef.current.position.z);
      camera.fov = 65;
    }
    camera.updateProjectionMatrix();
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
      <VoxelCharacter roleId={roleId} animation={animation} isMoving={isMoving} visible={cameraMode === 'THIRD_PERSON'} />
      <group position={[0, 2.2, 0]}>
         <mesh><planeGeometry args={[1, 0.1]} /><meshBasicMaterial color="#333" /></mesh>
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
      <Text position={[0, 2.5, 0]} fontSize={0.25} color="white">YOU</Text>
      <pointLight position={[0, 1.5, 0]} intensity={1} color={getRoleColor()} distance={5} />
    </group>
  );
}
