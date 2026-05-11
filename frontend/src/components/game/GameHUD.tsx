'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Clock, Shield, Target, Sword, Camera, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import socket from '@/utils/socket';

interface GameHUDProps {
  matchData: any;
  myUserId: string;
}

export default function GameHUD({ matchData, myUserId }: GameHUDProps) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [bossHp, setBossHp] = useState<number | null>(null);
  const [minionKills, setMinionKills] = useState(0);
  const myPlayer = matchData.match_players.find((p: any) => p.user_id === myUserId);
  const [playerPos, setPlayerPos] = useState({ 
    x: myPlayer?.spawn_pos?.[0] || 0, 
    z: myPlayer?.spawn_pos?.[2] || 0 
  });
  const [bossPos, setBossPos] = useState<{ x: number, z: number } | null>(null);
  const [showBigMap, setShowBigMap] = useState(false);
  
  const role = myPlayer?.role?.key || 'warrior';
  const isSolo = matchData.mode === 'SOLO_CHALLENGE';
  
  const mapData = matchData.map || {};
  const grid = mapData.grid || [];
  const mapWidth = mapData.width || 20;
  const mapHeight = mapData.height || 20;
  const cellScale = 4;

  const cameraMode = useGameStore(state => state.cameraMode);
  const toggleCameraMode = useGameStore(state => state.toggleCameraMode);

  useEffect(() => {
    const handleHp = (data: any) => {
      if (data.userId === myUserId) {
        setHp(data.hp);
        if (data.maxHp) setMaxHp(data.maxHp);
      }
    };

    const handleSoloTimer = (data: any) => setTimeLeft(data.timeLeft);
    const handleBossHp = (data: any) => setBossHp(data.hp);
    const handleBossSpawn = (data: any) => {
      setBossPos({ x: data.position[0], z: data.position[2] });
      setBossHp(data.hp);
    };
    const handleBossMove = (data: any) => {
      setBossPos({ x: data.position[0], z: data.position[2] });
    };
    const handleMinionDead = (data: any) => {
      if (data.attackerId === myUserId) setMinionKills(prev => prev + 1);
    };
    const handlePlayerUpdate = (data: any) => {
      if (data.userId === myUserId) {
        setPlayerPos({ x: data.position[0], z: data.position[2] });
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') setShowBigMap(prev => !prev);
    };

    socket.on('hp_update', handleHp);
    socket.on('solo_timer_tick', handleSoloTimer);
    socket.on('boss_hp_update', handleBossHp);
    socket.on('boss_spawned', handleBossSpawn);
    socket.on('boss_moved', handleBossMove);
    socket.on('minion_dead', handleMinionDead);
    socket.on('player_updated', handlePlayerUpdate);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.off('hp_update', handleHp);
      socket.off('solo_timer_tick', handleSoloTimer);
      socket.off('boss_hp_update', handleBossHp);
      socket.off('boss_spawned', handleBossSpawn);
      socket.off('boss_moved', handleBossMove);
      socket.off('minion_dead', handleMinionDead);
      socket.off('player_updated', handlePlayerUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [myUserId, matchData.id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'warrior': return <Shield className="text-red-500" />;
      case 'archer': return <Target className="text-green-500" />;
      case 'healer': return <Heart className="text-blue-500" />;
      case 'mage': return <Zap className="text-purple-500" />;
      default: return <Shield />;
    }
  };

  const worldWidth = mapWidth * cellScale;
  const worldHeight = mapHeight * cellScale;

  return (
    <div className="w-full h-full p-8 pointer-events-none flex flex-col justify-between">
      {/* BIG MAP OVERLAY */}
      <AnimatePresence>
        {showBigMap && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-20 pointer-events-auto"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowBigMap(false)}></div>
            <div className="relative w-full max-w-4xl aspect-square bg-game-dark border-4 border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col p-12">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-[0.5em]">Maze Explorer</h2>
                  <button onClick={() => setShowBigMap(false)} className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                     <X size={32} className="text-white" />
                  </button>
               </div>

               <div className="flex-grow relative bg-black/40 rounded-[2rem] border-2 border-white/5 overflow-hidden">
                  <div 
                    className="absolute inset-0"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${mapWidth}, 1fr)`,
                      gap: '0px'
                    }}
                  >
                    {grid.flat().map((cell: number, i: number) => (
                      <div key={i} className={`${cell === 1 ? 'bg-white/10' : 'bg-transparent'} border-[0.5px] border-white/5`} />
                    ))}
                  </div>

                  {/* Player Dot */}
                  <div 
                    className="absolute w-4 h-4 bg-game-blue rounded-full shadow-[0_0_20px_#3b82f6] z-20 transition-all duration-200"
                    style={{
                      left: `${(playerPos.x / worldWidth) * 100}%`,
                      top: `${(playerPos.z / worldHeight) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-game-blue uppercase tracking-widest">You</div>
                  </div>

                  {/* Boss Dot */}
                  {bossPos && (
                    <div 
                      className="absolute w-6 h-6 bg-red-600 rounded-full shadow-[0_0_30px_#ef4444] z-10 transition-all duration-500"
                      style={{
                        left: `${(bossPos.x / worldWidth) * 100}%`,
                        top: `${(bossPos.z / worldHeight) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Boss</div>
                    </div>
                  )}
               </div>

               <div className="mt-8 flex justify-center gap-12">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-game-blue rounded-full"></div>
                     <span className="text-xs font-bold text-white/60 uppercase">Your Position</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                     <span className="text-xs font-bold text-white/60 uppercase">Boss Location</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HUD */}
      <div className="flex justify-between items-start relative">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-6">
          <div className="relative">
             <div className="w-20 h-20 rounded-2xl bg-game-dark border-2 border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                {getRoleIcon()}
             </div>
             <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-game-gold text-black flex items-center justify-center font-black text-xs border-2 border-game-dark">LV1</div>
          </div>
          <div className="space-y-3">
             <div className="w-64">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Health (HP)</span>
                   <span className="text-xs font-black text-white">{Math.ceil(hp)} / {maxHp}</span>
                </div>
                <div className="h-3 bg-black/60 rounded-full border border-white/5 overflow-hidden p-[2px]">
                   <motion.div animate={{ width: `${(hp / maxHp) * 100}%` }} className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                </div>
             </div>
             {isSolo && (
                <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg">
                   <p className="text-[8px] font-black text-game-gold uppercase tracking-widest">Solo Challenge Task</p>
                   <p className="text-[10px] font-black text-white uppercase italic">Survive 5m or defeat the Boss</p>
                </div>
             )}
          </div>
        </motion.div>

        <AnimatePresence>
           {isSolo && bossHp !== null && bossHp > 0 && (
              <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="absolute left-1/2 -translate-x-1/2 top-0 w-96 text-center">
                 <p className="text-xs font-black text-red-500 uppercase tracking-[0.4em] mb-2 drop-shadow-lg">THE BOSS</p>
                 <div className="h-4 bg-black/80 rounded-full border-2 border-red-900/50 overflow-hidden shadow-2xl p-0.5">
                    <motion.div animate={{ width: `${(bossHp / 300) * 100}%` }} className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full" />
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        <motion.div animate={{ y: 0, opacity: 1 }} className="absolute left-1/2 -translate-x-1/2 mt-20 flex flex-col items-center pointer-events-auto cursor-pointer" onClick={toggleCameraMode}>
          <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3 shadow-xl hover:bg-black/80 transition-all">
            <Camera size={14} className="text-game-gold" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{cameraMode === 'THIRD_PERSON' ? 'Third Person' : 'First Person'}</span>
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold">V</div>
          </div>
        </motion.div>

        <div className="px-8 py-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 shadow-2xl">
           <Clock className="text-game-gold animate-pulse" size={24} />
           <span className="text-3xl font-black text-white tracking-widest font-mono">{formatTime(timeLeft)}</span>
        </div>

        <div className="game-panel bg-black/60 px-8 py-4 flex items-center gap-8">
           <div className="text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{isSolo ? 'Minions' : 'Kills'}</p>
              <p className="text-2xl font-black text-white">{isSolo ? minionKills : '0'}</p>
           </div>
           <div className="w-px h-10 bg-white/10"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{isSolo ? 'Mode' : 'Players'}</p>
              <p className="text-sm font-black text-game-gold uppercase tracking-widest">{isSolo ? 'Solo' : matchData.match_players.length}</p>
           </div>
        </div>
      </div>

      {/* BOTTOM HUD */}
      <div className="flex justify-between items-end">
         <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
               <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} className="w-16 h-16 rounded-xl bg-black/80 border border-white/10 flex items-center justify-center group cursor-pointer pointer-events-auto shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
                  <span className="text-[10px] font-black text-white/20 absolute top-1 left-2">{i}</span>
                  <Sword size={24} className="text-white/40 group-hover:text-white transition-colors" />
               </motion.div>
            ))}
         </div>

         <div className="w-48 h-48 rounded-2xl bg-black/90 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 p-2">
               <div className="w-full h-full relative bg-black/40 rounded-lg overflow-hidden">
                  {grid.length > 0 && (
                    <div 
                      className="absolute transition-all duration-100 ease-linear"
                      style={{
                        width: `${mapWidth * 8}px`,
                        height: `${mapHeight * 8}px`,
                        left: `${50 - ((playerPos.x / worldWidth) * 100)}%`,
                        top: `${50 - ((playerPos.z / worldHeight) * 100)}%`,
                        transform: 'translate(-50%, -50%)',
                        display: 'grid',
                        gridTemplateColumns: `repeat(${mapWidth}, 1fr)`,
                        gap: '0px'
                      }}
                    >
                      {grid.flat().map((cell: number, i: number) => (
                        <div key={i} className={`w-full h-full ${cell === 1 ? 'bg-white/20' : 'bg-transparent'}`} />
                      ))}

                      {/* Boss on Minimap - placed inside the grid to move with it */}
                      {bossPos && (
                        <div 
                          className="absolute w-2 h-2 bg-red-600 rounded-full z-10"
                          style={{
                            left: `${(bossPos.x / worldWidth) * 100}%`,
                            top: `${(bossPos.z / worldHeight) * 100}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        ></div>
                      )}
                    </div>
                  )}
                  {/* Player Dot - fixed at the center of minimap container */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-game-blue rounded-full glow-primary z-20 shadow-[0_0_10px_#3b82f6]"></div>
               </div>
            </div>
            <div className="absolute bottom-1 left-0 right-0 text-center flex flex-col items-center">
               <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Minimap</span>
               <span className="text-[6px] font-bold text-white/20 uppercase">[M] for Map</span>
            </div>
         </div>
      </div>
    </div>
  );
}
