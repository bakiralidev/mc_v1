'use client';

import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function UserCard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch'ni oldini olish uchun mounted holatini tekshiramiz
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return (
    <div className="w-[320px] h-[100px] flex gap-3">
       <button 
         onClick={() => window.location.href = '/auth'}
         className="flex-1 game-panel bg-white/5 hover:bg-game-gold hover:text-black transition-all border-white/10 flex flex-col items-center justify-center gap-1 group"
       >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-black/10 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Login</span>
       </button>
       <button 
         onClick={() => window.location.href = '/auth'}
         className="flex-1 game-panel bg-game-blue/10 hover:bg-game-blue hover:text-white transition-all border-game-blue/20 flex flex-col items-center justify-center gap-1 group"
       >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-black/10 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Register</span>
       </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[320px] h-[100px] game-panel p-5 bg-black/70 flex items-center gap-5 border-white/10 shadow-2xl"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-game-blue to-primary p-[2px] shadow-lg">
          <div className="w-full h-full rounded-[14px] bg-game-dark flex items-center justify-center overflow-hidden">
             <span className="text-3xl font-black text-white/60">{user.username[0].toUpperCase()}</span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-game-gold rounded-xl border-2 border-game-dark flex items-center justify-center text-[11px] font-black text-black">
          {user.stats?.level || 1}
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-black uppercase tracking-wider text-base text-white">{user.username}</span>
          <span className="text-[10px] font-black text-game-gold bg-game-gold/10 px-2 py-0.5 rounded border border-game-gold/20">LVL UP</span>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] font-black text-text-dim uppercase tracking-tighter">
            <span>XP Progress</span>
            <span className="text-white">{user.stats?.xp || 0} / 1000</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
             <div 
               className="h-full bg-gradient-to-r from-game-gold via-orange-500 to-red-500 transition-all duration-1000 rounded-full"
               style={{ width: `${Math.min(((user.stats?.xp || 0) / 1000) * 100, 100)}%` }}
             ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
