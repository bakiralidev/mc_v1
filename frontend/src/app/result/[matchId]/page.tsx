'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Home, RotateCcw, TrendingUp, Skull, Sword, Heart } from 'lucide-react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

export default function ResultPage() {
  const { matchId } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { width, height } = useWindowSize();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('last_result');
    if (data) {
      setResult(JSON.parse(data));
    } else {
      // Demo data if none found
      setResult({
        winner_team_id: 'team_alpha',
        is_winner: true,
        xp_earned: 450,
        kills: 3,
        deaths: 1,
        healing: 120,
        team_name: 'Team Alpha',
        match_duration: '05:24'
      });
    }
  }, []);

  if (!result) return null;

  return (
    <main className="relative min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden p-6">
      {result.is_winner && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.1} />}

      {/* Background Cinematic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[url('https://wallpaperaccess.com/full/1536411.jpg')] bg-cover bg-center opacity-5 grayscale"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Victory/Defeat Banner */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`inline-block text-[120px] font-black italic tracking-tighter leading-none mb-2 ${result.is_winner ? 'text-game-gold drop-shadow-[0_0_50px_rgba(251,191,36,0.5)]' : 'text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.5)]'}`}
          >
            {result.is_winner ? 'VICTORY' : 'DEFEAT'}
          </motion.div>
          <p className="text-white/40 font-bold uppercase tracking-[0.5em] text-sm">
            {result.team_name} • Match Duration: {result.match_duration}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* XP Breakdown */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="game-panel bg-black/60 p-8 col-span-1 md:col-span-2"
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black flex items-center gap-3">
                  <TrendingUp className="text-game-gold" />
                  <span className="uppercase tracking-widest">XP Progress</span>
               </h3>
               <span className="text-4xl font-black text-game-gold">+{result.xp_earned}</span>
            </div>
            
            <div className="space-y-4">
               <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-dim">
                  <span>Match Completion</span>
                  <span className="text-white">+200</span>
               </div>
               <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-dim">
                  <span>Victory Bonus</span>
                  <span className="text-white">{result.is_winner ? '+150' : '+0'}</span>
               </div>
               <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-dim">
                  <span>Performance</span>
                  <span className="text-white">+{result.xp_earned - (result.is_winner ? 350 : 200)}</span>
               </div>
               
               <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-black uppercase text-text-dim mb-2">
                     <span>Level {user?.stats?.level || 1}</span>
                     <span>Level {(user?.stats?.level || 1) + 1}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '65%' }}
                       transition={{ duration: 1.5, delay: 0.5 }}
                       className="h-full bg-gradient-to-r from-game-gold to-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                     />
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Combat Stats */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="game-panel bg-black/60 p-8 flex flex-col justify-between"
          >
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <Skull className="text-red-500" size={24} />
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Kills</p>
                      <p className="text-2xl font-black">{result.kills}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <Sword className="text-game-blue" size={24} />
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Deaths</p>
                      <p className="text-2xl font-black">{result.deaths}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <Heart className="text-green-500" size={24} />
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Healing</p>
                      <p className="text-2xl font-black">{result.healing}</p>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <button 
            onClick={() => router.push('/')}
            className="flex-1 game-btn-blue h-[68px] flex items-center justify-center gap-3 group"
          >
            <Home size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-lg font-black tracking-widest">MAIN MENU</span>
          </button>
          
          <button 
            onClick={() => router.push('/')} // Re-queue logic
            className="flex-1 game-btn-gold h-[68px] flex items-center justify-center gap-3 group shadow-[0_10px_40px_rgba(251,191,36,0.1)]"
          >
            <RotateCcw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-lg font-black tracking-widest">PLAY AGAIN</span>
          </button>
        </motion.div>
      </div>
    </main>
  );
}
