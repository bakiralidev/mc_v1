'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars, Environment, ContactShadows } from '@react-three/drei';
import { useAuthStore } from '@/store/authStore';
import socket from '@/utils/socket';
import api from '@/utils/api';
import GameScene from '@/components/game/GameScene';
import GameHUD from '@/components/game/GameHUD';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MatchPage() {
  const params = useParams();
  const matchId = Array.isArray(params.matchId) ? params.matchId[0] : params.matchId;
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    const initMatch = async () => {
      try {
        const { data } = await api.get(`/lobby/${matchId}`);
        setMatchData(data);
        
        if (!socket.connected) {
          socket.connect();
          socket.on('connect', () => {
            console.log("Socket connected, joining room:", matchId);
            socket.emit('join_lobby', matchId);
          });
        } else {
          socket.emit('join_lobby', matchId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Match init failed", err);
        router.push('/');
      }
    };

    initMatch();

    socket.on('match_ended', (result) => {
      localStorage.setItem('last_result', JSON.stringify(result));
      router.push(`/result/${matchId}`);
    });

    return () => {
      socket.off('match_ended');
    };
  }, [matchId, token, router]);

  if (loading || !matchData) {
    return (
      <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center gap-8">
        <div className="relative">
           <Loader2 className="animate-spin text-game-gold" size={80} />
           <div className="absolute inset-0 bg-game-gold/20 blur-3xl rounded-full"></div>
        </div>
        <div className="text-center">
           <h2 className="text-3xl font-black text-white uppercase tracking-[0.3em] animate-pulse">Entering the Maze</h2>
           <p className="text-text-dim text-sm mt-2 font-bold uppercase tracking-widest">Preparing 3D Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen bg-[#020617] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [15, 15, 15], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          <pointLight position={[-10, 10, -10]} intensity={1} color="#3b82f6" />
          
          <GameScene matchData={matchData} myUserId={user?.id || ''} matchId={matchId} />
          
          <Environment preset="night" />
          <ContactShadows opacity={0.4} scale={20} blur={2.4} far={4.5} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <GameHUD matchData={matchData} myUserId={user?.id || ''} />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(2,6,23,0.4)_100%)]"></div>
    </main>
  );
}
