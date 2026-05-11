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
import Boss from './Boss';
import Minion from './Minion';
import { motion, AnimatePresence } from 'framer-motion';
import { Html } from '@react-three/drei';
import { GAME_BALANCE } from '@/utils/gameBalance';

interface GameSceneProps {
  matchId: string;
  myUserId: string;
  matchData: any;
}

export default function GameScene({ matchId, myUserId, matchData }: GameSceneProps) {
  const [remotePlayers, setRemotePlayers] = useState<any[]>([]);
  const [projectiles, setProjectiles] = useState<any[]>([]);
  const [boss, setBoss] = useState<any>(null);
  const [minions, setMinions] = useState<any[]>([]);
  const [matchStatus, setMatchStatus] = useState<'playing' | 'finished'>('playing');
  const [winner, setWinner] = useState<string | null>(null);
  const [endReason, setEndReason] = useState<string>('');
  const scene = useThree((state) => state.scene);
  const router = useRouter();

  const mapData = useMemo(() => ({
    grid: matchData.map?.grid || [],
    width: matchData.map?.width || 20,
    height: matchData.map?.height || 20
  }), [matchData]);

  useEffect(() => {
    socket.emit('join_lobby', matchId);

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
      setRemotePlayers(prev => prev.filter(p => p.userId !== data.victimId));
      if (data.victimId === myUserId) {
         setMatchStatus('finished');
         setWinner('ENEMY');
      }
    });

    socket.on('boss_spawned', (data) => {
      setBoss(data);
    });

    socket.on('boss_moved', (data) => {
      setBoss(prev => prev ? { ...prev, ...data } : null);
    });

    socket.on('minion_spawned', (data) => {
      setMinions(prev => [...prev, data]);
    });

    socket.on('minion_moved', (data) => {
      setMinions(prev => prev.map(m => m.id === data.id ? { ...m, ...data } : m));
    });

    socket.on('minion_dead', (data) => {
      setMinions(prev => prev.filter(m => m.id !== data.id));
    });

    socket.on('match_ended', (data) => {
      setMatchStatus('finished');
      setWinner(data.victory ? myUserId : 'ENEMY');
      setEndReason(data.reason);
    });

    socket.on('enemy_attack', (data) => {
       if (data.targetId === myUserId) {
          socket.emit('player_damaged', {
             lobbyCode: matchId,
             victimId: myUserId,
             attackerId: data.enemyId,
             damage: data.damage
          });
       }
    });

    socket.on('fireball_fired', (data) => {
       setProjectiles(prev => [...prev, { ...data, id: Math.random().toString() }]);
    });

    return () => {
      socket.off('player_updated');
      socket.off('player_eliminated');
      socket.off('boss_spawned');
      socket.off('boss_moved');
      socket.off('minion_spawned');
      socket.off('minion_moved');
      socket.off('minion_dead');
      socket.off('match_ended');
      socket.off('enemy_attack');
      socket.off('fireball_fired');
    };
  }, [matchId, myUserId]);

  const handleFireballImpact = (fireball: any) => {
    if (fireball.userId === myUserId) {
       const mageConfig = GAME_BALANCE.roles.mage;
       const explosionRadius = mageConfig.skill.radius;
       const damage = mageConfig.skill.damage;

       scene.traverse((obj) => {
          if (obj.name === 'remote_player') {
             const dist = new THREE.Vector3(...fireball.targetPos).distanceTo(obj.position);
             if (dist <= explosionRadius) {
                socket.emit('player_damaged', { lobbyCode: matchId, victimId: obj.userData.userId, attackerId: myUserId, damage });
             }
          }
          if (obj.name === 'boss' || obj.name === 'minion') {
             const dist = new THREE.Vector3(...fireball.targetPos).distanceTo(obj.position);
             if (dist <= explosionRadius) {
                socket.emit('enemy_damaged', { lobbyCode: matchId, enemyId: obj.userData.enemyId, attackerId: myUserId, damage });
             }
          }
       });
    }
    setTimeout(() => setProjectiles(prev => prev.filter(p => p.id !== fireball.id)), 1200);
  };

  useEffect(() => {
    if (matchData && matchData.match_players) {
      const others = matchData.match_players.filter((p: any) => p.user_id !== myUserId && p.status !== 'DEAD');
      setRemotePlayers(others.map((p: any) => ({
        userId: p.user_id, username: p.user.username, teamId: p.team_id, roleId: p.role?.key || 'warrior',
        position: p.spawn_pos || [0, 1, 0], rotation: [0, 0, 0]
      })));
    }
  }, [matchData, myUserId]);

  const myPlayer = matchData.match_players.find((p: any) => p.user_id === myUserId);
  const myRoleKey = myPlayer?.role?.key || 'warrior';

  return (
    <>
      <MazeMap grid={mapData.grid} width={mapData.width} height={mapData.height} />
      <Player myUserId={myUserId} matchId={matchId} initialPos={myPlayer?.spawn_pos || [2, 1, 2]} roleId={myRoleKey} grid={mapData.grid} />
      {remotePlayers.map((player) => (
        <RemotePlayer key={player.userId} data={player} myTeamId={myPlayer?.team_id} />
      ))}
      {boss && <Boss data={boss} />}
      {minions.map(m => <Minion key={m.id} data={m} />)}
      {projectiles.map((p) => (
         <Projectile key={p.id} startPos={p.startPos} targetPos={p.targetPos} onImpact={() => handleFireballImpact(p)} />
      ))}
      <Html fullscreen>
        <AnimatePresence>
           {matchStatus === 'finished' && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
                 <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 bg-white/5 border border-white/10 rounded-[4rem] shadow-2xl">
                    <h2 className={`text-8xl font-black italic uppercase tracking-tighter mb-4 ${winner === myUserId ? 'text-game-gold' : 'text-red-500'}`}>
                       {winner === myUserId ? 'Victory' : 'Defeat'}
                    </h2>
                    <p className="text-white/60 text-xl mb-8 uppercase tracking-widest font-bold">
                       {endReason === 'SURVIVED' ? 'You survived 5 minutes!' : endReason === 'BOSS_KILLED' ? 'The Boss has been defeated!' : 'You were eliminated'}
                    </p>
                    <button onClick={() => router.push('/')} className="px-12 py-4 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-game-gold transition-all rounded-full">
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
