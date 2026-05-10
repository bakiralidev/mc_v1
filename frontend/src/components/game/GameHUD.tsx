'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Clock, Shield, Target, Sword } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GameHUDProps {
  matchData: any;
  myUserId: string;
}

export default function GameHUD({ matchData, myUserId }: GameHUDProps) {
  const [timeLeft, setTimeLeft] = useState(300);
  const myPlayer = matchData.match_players.find((p: any) => p.user_id === myUserId);
  const role = myPlayer?.role_id || 'warrior';

  useEffect(() => {
    // Server vaqtiga asoslangan sinxron taymer
    const calculateTimeLeft = () => {
      const startTime = new Date(matchData.started_at).getTime();
      const now = Date.now();
      const timeLimit = (matchData.settings?.time_limit || 300) * 1000;
      const elapsed = now - startTime;
      const remaining = Math.max(0, Math.floor((timeLimit - elapsed) / 1000));
      return remaining;
    };

    // Boshlang'ich hisob
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [matchData.started_at, matchData.settings?.time_limit]);

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

  return (
    <div className="w-full h-full p-8 pointer-events-none flex flex-col justify-between">
      {/* TOP HUD: Stats & Timer */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className="relative">
             <div className="w-20 h-20 rounded-2xl bg-game-dark border-2 border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                {getRoleIcon()}
             </div>
             <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-game-gold text-black flex items-center justify-center font-black text-xs border-2 border-game-dark">
                LV1
             </div>
          </div>

          <div className="space-y-3">
             <div className="w-64">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Health (HP)</span>
                   <span className="text-xs font-black text-white">100 / 100</span>
                </div>
                <div className="h-3 bg-black/60 rounded-full border border-white/5 overflow-hidden p-[2px]">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '100%' }}
                     className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.4)]" 
                   />
                </div>
             </div>
             <div className="w-48">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Energy</span>
                   <span className="text-xs font-black text-white">85 / 100</span>
                </div>
                <div className="h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden p-[1px]">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '85%' }}
                     className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                   />
                </div>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center"
        >
           <div className="px-8 py-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 shadow-2xl">
              <Clock className="text-game-gold animate-pulse" size={24} />
              <span className="text-3xl font-black text-white tracking-widest font-mono">
                 {formatTime(timeLeft)}
              </span>
           </div>
           <div className="mt-2 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Match Ends In</div>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="game-panel bg-black/60 px-8 py-4 flex items-center gap-8"
        >
           <div className="text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Kills</p>
              <p className="text-2xl font-black text-white">0</p>
           </div>
           <div className="w-px h-10 bg-white/10"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Players</p>
              <p className="text-2xl font-black text-white">{matchData.match_players.length}</p>
           </div>
        </motion.div>
      </div>

      <div className="flex justify-between items-end">
         <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
               <motion.div 
                 key={i}
                 whileHover={{ scale: 1.05, y: -5 }}
                 className="w-16 h-16 rounded-xl bg-black/80 border border-white/10 flex items-center justify-center group cursor-pointer pointer-events-auto shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
                  <span className="text-[10px] font-black text-white/20 absolute top-1 left-2">{i}</span>
                  <Sword size={24} className="text-white/40 group-hover:text-white transition-colors" />
               </motion.div>
            ))}
         </div>

         <div className="w-48 h-48 rounded-2xl bg-black/80 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
               <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-game-blue rounded-full glow-primary"></div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
               <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Maze Map</span>
            </div>
         </div>
      </div>
    </div>
  );
}
