'use client';

import { Suspense, useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Plane } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Shield, Sword, Heart, Zap, Play, Square, X } from 'lucide-react';
import * as THREE from 'three';
import Projectile from '@/components/game/Projectile';

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

// --- VOXEL DATA FUNCTIONS ---
const getWarriorHead = () => {
  const v: { pos: [number, number, number], color: string }[] = [];
  for (let x=-4; x<4; x++) for (let y=0; y<8; y++) for (let z=-5; z<5; z++) {
    let color = '#d4a373'; let isHair = false; let isSkin = false;
    if (x >= -4 && x <= 3 && y >= 0 && y <= 5 && z >= -2 && z <= 3) isSkin = true;
    if (y >= 6 || z <= -3 || ((x === -4 || x === 3) && y >= 1 && z <= 2) || (z >= 4 && y >= 6)) isHair = true;
    if (isHair) color = '#4b2e2a';
    if (z === 3 && isSkin) {
      if (y === 5 && (x === -3 || x === -2 || x === 1 || x === 2)) color = '#2d1a18';
      if ((y === 4 || y === 3) && (x === -3 || x === -2 || x === 1 || x === 2)) color = '#ffffff';
      if (y === 4 && (x === -2 || x === 1)) color = '#1a1a1a';
      if (y === 0 && (x === -1 || x === 0)) color = '#1a1a1a';
    }
    if (isHair || isSkin) v.push({ pos: [x, y, z], color });
  }
  return v;
};

const getMageHead = () => {
  const v: { pos: [number, number, number], color: string }[] = [];
  for (let x=-4; x<4; x++) for (let y=0; y<6; y++) for (let z=-2; z<3; z++) {
    let color = '#f3d5b5'; if (z === 2) {
       if (y === 4 && (x === -3 || x === -2 || x === 1 || x === 2)) color = '#2d1a18';
       if (y === 3 && (x === -3 || x === -2 || x === 1 || x === 2)) color = '#ffffff';
       if (y === 3 && (x === -2 || x === 1)) color = '#5b21b6';
       if (y === 0 && (x === -1 || x === 0)) color = '#1a1a1a';
    }
    v.push({ pos: [x, y, z], color });
  }
  for (let y=6; y<16; y++) {
    const r = Math.max(1, 6 - (y-6));
    for (let x=-r; x<r; x++) for (let z=-r; z<r; z++) v.push({ pos: [x, y, z], color: y===6?'#eab308':'#5b21b6' });
  }
  return v;
};

const getArcherHead = () => {
  const v: { pos: [number, number, number], color: string }[] = [];
  for (let x=-4; x<4; x++) for (let y=0; y<6; y++) for (let z=-2; z<3; z++) {
    let color = '#d4a373'; if (z===2) {
       if (y===4 && (x===-3||x===-2||x===1||x===2)) color = '#2d1a18';
       if (y===3 && (x===-3||x===-2||x===1||x===2)) color = '#ffffff';
       if (y===3 && (x===-2||x===1)) color = '#16a34a';
       if (y===0 && (x===-1||x===0)) color = '#1a1a1a';
    }
    v.push({ pos: [x, y, z], color });
  }
  for (let x=-5; x<5; x++) for (let y=0; y<9; y++) for (let z=-3; z<3; z++) {
    if (y>5 || Math.abs(x)>3 || z<1) v.push({ pos:[x,y,z], color: '#166534' });
  }
  return v;
};

const getHealerHead = () => {
  const v: { pos: [number, number, number], color: string }[] = [];
  for (let x=-4; x<4; x++) for (let y=0; y<6; y++) for (let z=-2; z<3; z++) {
    let color = '#fef3c7'; if (z===2) {
       if (y===4 && (x===-3||x===-2||x===1||x===2)) color = '#2d1a18';
       if (y===3 && (x===-3||x===-2||x===1||x===2)) color = '#ffffff';
       if (y===3 && (x===-2||x===1)) color = '#2563eb';
       if (y===0 && (x===-1||x===0)) color = '#1a1a1a';
    }
    v.push({ pos: [x, y, z], color });
  }
  for (let x=-5; x<5; x++) for (let y=-2; y<8; y++) for (let z=-4; z<2; z++) {
    if (y>5 || Math.abs(x)>3 || z<-1) v.push({ pos:[x,y,z], color: '#f8fafc' });
  }
  return v;
};

function GenericModel({ roleId, animation, startTime, onFinish }: { roleId: string, animation: string, startTime: number, onFinish: () => void }) {
  const headVoxels = useMemo(() => {
    if (roleId === 'warrior') return getWarriorHead();
    if (roleId === 'mage') return getMageHead();
    if (roleId === 'archer') return getArcherHead();
    return getHealerHead();
  }, [roleId]);

  const bodyVoxels = useMemo(() => {
    const v: { pos: [number, number, number], color: string }[] = [];
    const color = roleId === 'warrior' ? '#4b5563' : roleId === 'mage' ? '#4c1d95' : roleId === 'archer' ? '#166534' : '#f8fafc';
    for (let x=-6; x<6; x++) for (let y=0; y<14; y++) for (let z=-3; z<3; z++) {
       let c = color;
       if (roleId === 'healer' && (x===-6||x===5)) c = '#3b82f6';
       v.push({ pos: [x, y, z], color: c });
    }
    return v;
  }, [roleId]);

  const armVoxels = useMemo(() => getLimbVoxels(roleId === 'warrior' ? '#3f3f46' : roleId === 'mage' ? '#5b21b6' : roleId === 'archer' ? '#16a34a' : '#bfdbfe', 4, 14, 4), [roleId]);
  const legVoxels = useMemo(() => getLimbVoxels(roleId === 'warrior' ? '#27272a' : roleId === 'mage' ? '#1e1b4b' : roleId === 'archer' ? '#064e3b' : '#1e3a8a', 5, 14, 5), [roleId]);

  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const lArmRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);
  const lLegRef = useRef<THREE.Group>(null);
  const rLegRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime() - startTime;
    const isAnim = elapsed < (animation === 'jump' ? 1.0 : 0.5);
    [headRef, bodyRef, lArmRef, rArmRef, lLegRef, rLegRef].forEach(r => {
       if (r.current) {
          r.current.position.y = r === headRef ? 1.4 : r === lLegRef || r === rLegRef ? 0 : 0.7;
          r.current.rotation.set(0,0,0);
       }
    });
    if (animation === 'jump' && isAnim) {
      const jY = Math.sin((elapsed/1.0)*Math.PI)*1.5;
      [headRef, bodyRef, lArmRef, rArmRef, lLegRef, rLegRef].forEach(r => { if(r.current) r.current.position.y += jY; });
      if (elapsed/1.0>0.1 && elapsed/1.0<0.8) { 
        if(lLegRef.current) lLegRef.current.rotation.x = -0.5; 
        if(rLegRef.current) rLegRef.current.rotation.x = -0.5; 
      }
    } else if (animation === 'attack' && isAnim) {
      const atk = Math.sin((elapsed/0.5)*Math.PI);
      if(bodyRef.current) bodyRef.current.rotation.y = atk*0.5; 
      if(rArmRef.current) rArmRef.current.rotation.x = -atk*1.5;
    } else if (animation !== 'idle' && !isAnim) onFinish();
  });

  return (
    <group position={[0, -1, 0]}>
      <group ref={headRef} position={[0,1.4,0]}><VoxelGroup voxels={headVoxels} size={0.05}/></group>
      <group ref={bodyRef} position={[0,0.7,0]}><VoxelGroup voxels={bodyVoxels} size={0.05}/></group>
      <group ref={lArmRef} position={[-0.4,0.7,0]}><VoxelGroup voxels={armVoxels} size={0.05}/></group>
      <group ref={rArmRef} position={[0.4,0.7,0]}><VoxelGroup voxels={armVoxels} size={0.05}/></group>
      <group ref={lLegRef} position={[-0.15,0,0]}><VoxelGroup voxels={legVoxels} size={0.05}/></group>
      <group ref={rLegRef} position={[0.15,0,0]}><VoxelGroup voxels={legVoxels} size={0.05}/></group>
    </group>
  );
}

export default function CharactersPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [animation, setAnimation] = useState<string>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [projectiles, setProjectiles] = useState<any[]>([]);

  const roles = [
    { id: 'warrior', name: 'Warrior', icon: Shield, text: 'text-red-500' },
    { id: 'archer', name: 'Archer', icon: Sword, text: 'text-green-500' },
    { id: 'healer', name: 'Healer', icon: Heart, text: 'text-blue-500' },
    { id: 'mage', name: 'Mage', icon: Zap, text: 'text-purple-500' }
  ];
  const selectedRole = roles.find(r => r.id === selectedId);

  const handleLabAttack = (event: any) => {
    if (selectedId !== 'mage') {
       setAnimation('attack');
       setStartTime(performance.now()/1000);
       return;
    }

    // Mage fireball in lab
    const fireballId = Math.random().toString();
    const target = event.point;
    setProjectiles(prev => [...prev, { 
      id: fireballId, 
      startPos: [0, 1, 0], // Balandroqdan (hassa balandligidan) boshlanadi
      targetPos: [target.x, 0.1, target.z] // Yerga tegadi
    }]);
    
    setAnimation('attack');
    setStartTime(performance.now()/1000);
  };

  return (
    <main className="relative h-screen w-screen bg-[#020617] overflow-hidden font-game select-none">
      <div className="absolute inset-0 z-0"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_100%)]"></div></div>
      <AnimatePresence mode="wait">
        {!selectedId ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pt-24 grid grid-cols-2 grid-rows-2">
            {roles.map(role => (
              <div key={role.id} onClick={() => setSelectedId(role.id)} className="relative border border-white/5 bg-black/20 group hover:bg-white/5 transition-all overflow-hidden cursor-pointer">
                <div className="absolute top-6 left-8 z-10"><h3 className="text-2xl font-black text-white uppercase flex items-center gap-4"><role.icon size={20} className={role.text} />{role.name}</h3></div>
                <Canvas camera={{ position: [5, 5, 5], fov: 40 }}>
                   <ambientLight intensity={1} /><pointLight position={[10, 10, 10]} intensity={1.5} />
                   <Suspense fallback={null}><GenericModel roleId={role.id} animation="idle" startTime={0} onFinish={() => {}} /><Environment preset="city" /></Suspense>
                </Canvas>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="full" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="absolute inset-0 z-50 bg-black flex flex-col">
             <div className="h-20 flex items-center justify-between px-12 border-b border-white/10 bg-white/5 backdrop-blur-3xl">
                <div className="flex items-center gap-6"><selectedRole.icon size={32} className={selectedRole.text} /><h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{selectedRole.name}</h2></div>
                <button onClick={() => setSelectedId(null)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-all border border-white/10"><X size={24} /></button>
             </div>
             <div className="flex-1 relative">
                <Canvas camera={{ position: [8, 8, 8], fov: 35 }}>
                   <ambientLight intensity={1.5} /><directionalLight position={[10, 10, 5]} intensity={2.5} />
                   <Suspense fallback={null}>
                      <GenericModel roleId={selectedId} animation={animation} startTime={startTime} onFinish={() => setAnimation('idle')} />
                      
                      {/* Interactive Ground for Testing */}
                      <Plane 
                        args={[20, 20]} 
                        rotation={[-Math.PI/2, 0, 0]} 
                        position={[0, -1, 0]} 
                        onPointerDown={handleLabAttack}
                      >
                         <meshStandardMaterial color="#0f172a" roughness={0.8} />
                      </Plane>

                      {projectiles.map(p => (
                         <Projectile 
                            key={p.id} 
                            startPos={p.startPos} 
                            targetPos={p.targetPos} 
                            onImpact={() => {
                               setTimeout(() => setProjectiles(prev => prev.filter(pr => pr.id !== p.id)), 1000);
                            }} 
                         />
                      ))}

                      <Environment preset="city" />
                      <ContactShadows opacity={0.5} scale={10} blur={2} far={4.5} />
                   </Suspense>
                   <OrbitControls enableZoom={true} enablePan={true} />
                </Canvas>
                
                <div className="absolute top-12 left-12 max-w-[250px] space-y-4">
                   <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-black text-game-gold uppercase tracking-[0.3em] mb-2">Training Mode</p>
                      <p className="text-white/60 text-xs leading-relaxed">
                         {selectedId === 'mage' ? "Click anywhere on the floor to launch a Fireball and test the explosion effect." : "Click on the floor to trigger the basic attack animation."}
                      </p>
                   </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                   <button onClick={() => { setAnimation('idle'); setStartTime(0); }} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${animation === 'idle' ? 'bg-game-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}><Square size={14} /> Idle</button>
                   <button onClick={() => { setAnimation('jump'); setStartTime(performance.now()/1000); }} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${animation === 'jump' ? 'bg-game-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}><Play size={14} className="-rotate-90" /> Jump</button>
                   <button onClick={() => { setAnimation('attack'); setStartTime(performance.now()/1000); }} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${animation === 'attack' ? 'bg-game-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}><Sword size={14} /> Attack</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
