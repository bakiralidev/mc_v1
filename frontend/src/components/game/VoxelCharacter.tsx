'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- VOXEL ENGINE HELPER ---
function VoxelGroup({ voxels, size = 0.05 }: { voxels: { pos: [number, number, number], color: string }[], size?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;
    voxels.forEach((v, i) => {
      tempObject.position.set(v.pos[0] * size, v.pos[1] * size, v.pos[2] * size);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      meshRef.current!.setColorAt(i, new THREE.Color(v.color));
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [voxels, size]);

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, voxels.length]} frustumCulled={false}>
      <boxGeometry args={[size * 0.98, size * 0.98, size * 0.98]} />
      <meshLambertMaterial roughness={0.8} /> 
    </instancedMesh>
  );
}

// --- PART GENERATORS ---
const getLimbVoxels = (color: string, w: number, h: number, d: number) => {
  const v: { pos: [number, number, number], color: string }[] = [];
  for (let x = -w/2; x < w/2; x++) for (let y = 0; y < h; y++) for (let z = -d/2; z < d/2; z++) v.push({ pos: [x, y, z], color });
  return v;
};

const getWeaponVoxels = (roleId: string) => {
  const v: { pos: [number, number, number], color: string }[] = [];
  if (roleId === 'warrior') {
    // Sword
    for (let y=0; y<12; y++) for (let x=-1; x<1; x++) for (let z=-1; z<1; z++) v.push({ pos:[x,y,z], color: y<3?'#713f12':'#94a3b8' });
    for (let x=-3; x<3; x++) v.push({ pos:[x,3,0], color:'#eab308'}); // Guard
  } else if (roleId === 'archer') {
    // Bow
    for (let y=-6; y<6; y++) {
      const x = Math.abs(y) > 3 ? 0 : 1;
      v.push({ pos:[x,y,0], color:'#166534'});
    }
  } else if (roleId === 'mage') {
    // Staff
    for (let y=0; y<15; y++) v.push({ pos:[0,y,0], color:'#4b2e2a'});
    for (let x=-2; x<2; x++) for (let z=-2; z<2; z++) v.push({ pos:[x,15,z], color:'#a855f7'}); // Crystal
  }
  return v;
};

// ... (Other generators from previous Lab logic) ...
const getRoleHead = (roleId: string) => {
  const v: { pos: [number, number, number], color: string }[] = [];
  const skin = roleId === 'warrior' || roleId === 'archer' ? '#d4a373' : '#fef3c7';
  const eye = roleId === 'warrior' ? '#1a1a1a' : roleId === 'mage' ? '#5b21b6' : roleId === 'archer' ? '#16a34a' : '#2563eb';
  
  for (let x=-4; x<4; x++) for (let y=0; y<6; y++) for (let z=-2; z<3; z++) {
    let color = skin; if (z===2) {
       if (y===4 && (x===-3||x===-2||x===1||x===2)) color = '#2d1a18';
       if (y===3 && (x===-3||x===-2||x===1||x===2)) color = '#ffffff';
       if (y===3 && (x===-2||x===1)) color = eye;
       if (y===0 && (x===-1||x===0)) color = '#1a1a1a';
    }
    v.push({ pos: [x, y, z], color });
  }
  // Add Hair/Hat
  if (roleId === 'mage') {
    for (let y=6; y<14; y++) {
      const r = Math.max(1, 6 - (y-6));
      for (let x=-r; x<r; x++) for (let z=-r; z<r; z++) v.push({ pos:[x,y,z], color: y===6?'#eab308':'#5b21b6' });
    }
  } else {
    const hairColor = roleId === 'archer' ? '#166534' : roleId === 'warrior' ? '#4b2e2a' : '#f8fafc';
    for (let x=-5; x<5; x++) for (let y=0; y<8; y++) for (let z=-4; z<2; z++) {
       if (y>5 || Math.abs(x)>3 || z<-1) v.push({ pos:[x,y,z], color: hairColor });
    }
  }
  return v;
};

const getRoleBody = (roleId: string) => {
  const v: { pos: [number, number, number], color: string }[] = [];
  const color = roleId === 'warrior' ? '#4b5563' : roleId === 'mage' ? '#4c1d95' : roleId === 'archer' ? '#166534' : '#f8fafc';
  for (let x=-6; x<6; x++) for (let y=0; y<14; y++) for (let z=-3; z<3; z++) {
     let c = color;
     if (roleId === 'warrior' && z===2 && y>6 && y<11 && (Math.abs(x)<1 || (y===8 && Math.abs(x)<3))) c = '#eab308';
     if (roleId === 'healer' && (x===-6||x===5)) c = '#3b82f6';
     v.push({ pos: [x, y, z], color: c });
  }
  return v;
};

export default function VoxelCharacter({ roleId, animation = 'idle', isMoving = false }: { roleId: string, animation?: string, isMoving?: boolean }) {
  const head = useMemo(() => getRoleHead(roleId), [roleId]);
  const body = useMemo(() => getRoleBody(roleId), [roleId]);
  const arm = useMemo(() => getLimbVoxels(roleId === 'warrior' ? '#3f3f46' : roleId === 'mage' ? '#5b21b6' : roleId === 'archer' ? '#16a34a' : '#bfdbfe', 4, 14, 4), [roleId]);
  const leg = useMemo(() => getLimbVoxels(roleId === 'warrior' ? '#27272a' : roleId === 'mage' ? '#1e1b4b' : roleId === 'archer' ? '#064e3b' : '#1e3a8a', 5, 14, 5), [roleId]);
  const weapon = useMemo(() => getWeaponVoxels(roleId), [roleId]);

  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const lArmRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);
  const lLegRef = useRef<THREE.Group>(null);
  const rLegRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Default Positions
    headRef.current!.position.y = 1.4;
    bodyRef.current!.position.y = 0.7;
    lArmRef.current!.position.y = 0.7;
    rArmRef.current!.position.y = 0.7;
    lLegRef.current!.position.y = 0;
    rLegRef.current!.position.y = 0;
    
    headRef.current!.rotation.set(0,0,0);
    lArmRef.current!.rotation.set(0,0,0);
    rArmRef.current!.rotation.set(0,0,0);
    lLegRef.current!.rotation.set(0,0,0);
    rLegRef.current!.rotation.set(0,0,0);

    // Walking / Movement Animation
    if (isMoving) {
      const walkSpeed = 12;
      const walkRange = 0.6;
      lLegRef.current!.rotation.x = Math.sin(t * walkSpeed) * walkRange;
      rLegRef.current!.rotation.x = -Math.sin(t * walkSpeed) * walkRange;
      lArmRef.current!.rotation.x = -Math.sin(t * walkSpeed) * walkRange;
      rArmRef.current!.rotation.x = Math.sin(t * walkSpeed) * walkRange;
    }

    // Special Combat Animations
    if (animation === 'attack') {
      const atk = Math.sin(t * 20);
      rArmRef.current!.rotation.x = -1.5 + atk;
    }
  });

  return (
    <group scale={0.5} position={[0, -0.5, 0]}>
      <group ref={headRef} position={[0, 1.4, 0]}><VoxelGroup voxels={head}/></group>
      <group ref={bodyRef} position={[0, 0.7, 0]}><VoxelGroup voxels={body}/></group>
      <group ref={lArmRef} position={[-0.4, 0.7, 0]}><VoxelGroup voxels={arm}/></group>
      <group ref={rArmRef} position={[0.4, 0.7, 0]}>
        <VoxelGroup voxels={arm}/>
        <group ref={weaponRef} position={[0, -0.2, 0.3]} rotation={[1, 0, 0]}>
          <VoxelGroup voxels={weapon}/>
        </group>
      </group>
      <group ref={lLegRef} position={[-0.15, 0, 0]}><VoxelGroup voxels={leg}/></group>
      <group ref={rLegRef} position={[0.15, 0, 0]}><VoxelGroup voxels={leg}/></group>
    </group>
  );
}
