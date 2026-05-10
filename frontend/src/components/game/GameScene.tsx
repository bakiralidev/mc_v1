'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import socket from '@/utils/socket';
import MazeMap from './MazeMap';
import Player from './Player';
import RemotePlayer from './RemotePlayer';
import Projectile from './Projectile';

interface GameSceneProps {
  matchId: string;
  myUserId: string;
  matchData: any;
}

import { motion, AnimatePresence } from 'framer-motion';
import { Html } from '@react-three/drei';

export default function GameScene({ matchId, myUserId, matchData }: GameSceneProps) {
  const [remotePlayers, setRemotePlayers] = useState<any[]>([]);
  const [projectiles, setProjectiles] = useState<any[]>([]);
  const [matchStatus, setMatchStatus] = useState<'playing' | 'finished'>('playing');
  const [winner, setWinner] = useState<string | null>(null);
  const scene = useThree((state) => state.scene);
  const router = useRouter();

  const mapData = useMemo(() => ({
    grid: matchData.grid || [],
    width: matchData.width || 20,
    height: matchData.height || 20
  }), [matchData]);


  useEffect(() => {
    // Ensure we are in the correct socket room for this match
    console.log("Joining lobby room:", matchId);
    socket.emit('join_lobby', matchId);

    // Listen for remote player updates
    socket.on('player_updated', (data) => {
      setRemotePlayers((prev) => {
        const index = prev.findIndex((p) => p.userId === data.userId);
        if (index !== -1) {
          const newPlayers = [...prev];
          newPlayers[index] = { ...newPlayers[index], ...data };
          return newPlayers;
        }
        return prev;
      });
    });

    socket.on('player_eliminated', (data) => {
      console.log("Player eliminated:", data);
      
      setRemotePlayers(prev => {
        const updated = prev.filter(p => p.userId !== data.victimId);
        
        // Agar o'lgan o'yinchi men bo'lmasam va boshqa hech kim qolmagan bo'lsa - G'alaba!
        if (data.victimId !== myUserId && updated.length === 0) {
           setMatchStatus('finished');
           setWinner(myUserId);
        }
        
        return updated;
      });

      if (data.victimId === myUserId) {
         setMatchStatus('finished');
         setWinner(data.attackerId);
      }
    });

    socket.on('fireball_fired', (data) => {
       console.log("Fireball received:", data);
       setProjectiles(prev => [...prev, { ...data, id: Math.random().toString() }]);
    });

    return () => {
      socket.off('player_updated');
      socket.off('player_eliminated');
      socket.off('fireball_fired');
    };
  }, [matchId, myUserId]);

  const handleFireballImpact = (fireball: any) => {
    if (fireball.userId === myUserId) {
       const explosionRadius = 3.5;
       const damage = 25;

       scene.traverse((obj) => {
          if (obj.name === 'remote_player') {
             const dist = new THREE.Vector3(...fireball.targetPos).distanceTo(obj.position);
             if (dist <= explosionRadius) {
                socket.emit('player_damaged', {
                   lobbyCode: matchId,
                   victimId: obj.userData.userId,
                   attackerId: myUserId,
                   damage: damage
                });
             }
          }
       });
    }
    
    setTimeout(() => {
       setProjectiles(prev => prev.filter(p => p.id !== fireball.id));
    }, 1200);
  };

  useEffect(() => {
    if (matchData && matchData.match_players) {
      const others = matchData.match_players.filter((p: any) => 
        p.user_id !== myUserId && p.status !== 'DEAD'
      );
      setRemotePlayers(others.map((p: any) => ({
        userId: p.user_id,
        username: p.user.username,
        teamId: p.team_id,
        roleId: p.role?.key || 'warrior',
        position: p.spawn_pos || [Math.random() * 5, 1, Math.random() * 5],
        rotation: [0, 0, 0]
      })));
    }
  }, [matchData, myUserId]);

  const myPlayer = matchData.match_players.find((p: any) => p.user_id === myUserId);
  const myRoleKey = myPlayer?.role?.key || 'warrior';

  return (
    <>
      <MazeMap grid={mapData.grid} width={mapData.width} height={mapData.height} />
      
      {/* Local Player */}
      <Player 
        myUserId={myUserId} 
        matchId={matchId} 
        initialPos={myPlayer?.spawn_pos || [2, 1, 2]} 
        roleId={myRoleKey}
      />

      {/* Remote Players */}
      {remotePlayers.map((player) => (
        <RemotePlayer 
          key={player.userId} 
          data={player} 
          myTeamId={myPlayer?.team_id} 
        />
      ))}

      {/* Active Fireballs */}
      {projectiles.map((p) => (
         <Projectile 
            key={p.id} 
            startPos={p.startPos} 
            targetPos={p.targetPos} 
            onImpact={() => handleFireballImpact(p)} 
         />
      ))}

      {/* Victory/Defeat Overlay */}
      <Html fullscreen>
        <AnimatePresence>
           {matchStatus === 'finished' && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
                 <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-12 bg-white/5 border border-white/10 rounded-[4rem] shadow-2xl"
                 >
                    <h2 className={`text-8xl font-black italic uppercase tracking-tighter mb-4 ${winner === myUserId ? 'text-game-gold' : 'text-red-500'}`}>
                       {winner === myUserId ? 'Victory' : 'Game Over'}
                    </h2>
                    <p className="text-white/60 text-xl mb-8 uppercase tracking-widest font-bold">
                       {winner === myUserId ? 'You are the champion!' : 'Better luck next time'}
                    </p>
                    <button 
                       onClick={() => router.push('/')}
                       className="px-12 py-4 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-game-gold transition-all rounded-full"
                    >
                       Return to Menu
                    </button>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>
      </Html>
    </>
  );
}
