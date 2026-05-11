'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sky } from '@react-three/drei';
import MazeMap from '@/components/game/MazeMap';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function MazePreviewPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-[#020617] relative">
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/10 text-white rounded-full backdrop-blur-xl hover:bg-white/10 transition-all uppercase font-black text-xs tracking-widest"
        >
          <ChevronLeft size={18} />
          Back to Menu
        </motion.button>
      </div>

      <div className="absolute top-8 right-8 z-50 text-right pointer-events-none">
        <h1 className="text-4xl font-black italic text-game-gold tracking-tighter uppercase leading-none mb-1">Maze Showcase</h1>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.4em]">Explore the dynamic labyrinth architecture</p>
      </div>

      <Canvas shadows camera={{ position: [60, 45, 60], fov: 40 }}>
        <color attach="background" args={["#020617"]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sky sunPosition={[100, 10, 100]} turbidity={0.1} rayleigh={0.5} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[50, 100, 50]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        <group position={[-50, 0, -50]}>
           <MazeMap grid={[]} width={100} height={100} />
        </group>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={10} 
          maxDistance={180} 
          maxPolarAngle={Math.PI / 2.05} 
          makeDefault
        />
      </Canvas>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-black/20 px-8 py-3 rounded-full backdrop-blur-md border border-white/5">
         <div className="flex gap-12 items-center text-white/50 text-[10px] uppercase font-bold tracking-[0.3em]">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-game-gold rounded-full" /> Left Click: Rotate</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-game-blue rounded-full" /> Right Click: Pan</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full" /> Scroll: Zoom</div>
         </div>
      </div>
    </div>
  );
}
