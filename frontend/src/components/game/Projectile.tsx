'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProjectileProps {
  startPos: [number, number, number];
  targetPos: [number, number, number];
  onImpact: () => void;
}

export default function Projectile({ startPos, targetPos, onImpact }: ProjectileProps) {
  const ref = useRef<THREE.Group>(null);
  const [exploded, setExploded] = useState(false);
  const [scale, setScale] = useState(1);
  
  const start = useMemo(() => new THREE.Vector3(...startPos), [startPos]);
  const target = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const speed = 0.08; // Tezlik biroz tezlashtirildi (silliqlik uchun)
  const progress = useRef(0);

  useFrame((state, delta) => {
    if (exploded) {
       setScale(s => Math.min(4, s + delta * 12));
       return;
    }

    if (ref.current) {
      progress.current += speed * (delta * 60);
      const p = Math.min(progress.current, 1);
      ref.current.position.lerpVectors(start, target, p);

      ref.current.rotation.x += 0.2;
      ref.current.rotation.y += 0.2;

      if (p >= 1) {
        setExploded(true);
        onImpact();
      }
    }
  });

  if (exploded) {
     return (
        <mesh position={targetPos}>
           <sphereGeometry args={[scale, 32, 32]} />
           <meshStandardMaterial 
              color="#ff4500" 
              emissive="#ff4500" 
              emissiveIntensity={10} 
              transparent 
              opacity={Math.max(0, 1 - scale/4)} 
           />
           <pointLight intensity={10} color="#ff4500" distance={scale * 2} />
        </mesh>
     );
  }

  return (
    <group ref={ref} position={startPos}>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ff4500" emissive="#ff4500" emissiveIntensity={15} />
      </mesh>
      
      {/* Dum (Trail) effekti */}
      {[...Array(5)].map((_, i) => (
         <mesh key={i} position={[0, 0, (i + 1) * 0.2]}>
            <sphereGeometry args={[0.2 - i*0.03, 8, 8]} />
            <meshStandardMaterial color="#ffa500" transparent opacity={0.5 - i*0.1} />
         </mesh>
      ))}

      <pointLight intensity={2} color="#ff4500" distance={3} />
    </group>
  );
}
