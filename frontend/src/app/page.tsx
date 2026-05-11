'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import GameLogo from '@/components/home/GameLogo';
import MainMenuButtons from '@/components/home/MainMenuButtons';
import UserCard from '@/components/home/UserCard';
import MvpModePanel from '@/components/home/MvpModePanel';
import LatestUpdatePanel from '@/components/home/LatestUpdatePanel';
import FooterNav from '@/components/home/FooterNav';
import api from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { token, user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {});
    }
  }, [token, setUser]);

  return (
    <main className="relative h-screen w-screen bg-game-dark overflow-hidden font-game select-none">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110 animate-slow-pan opacity-100"
          style={{ backgroundImage: "url('/media/backgrounds/homebackgroun.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(2,6,23,0.3)_100%)]"></div>
      </div>

      {/* 5. TOP NAVIGATION SECTION */}
      <div className="absolute top-6 left-16 right-16 z-40">
        <FooterNav />
      </div>

      {/* 0. TOP-LEFT: Characters & Maze Buttons */}
      <div className="absolute top-24 left-16 z-30 flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/characters')}
          className="game-panel px-6 py-3 bg-black/60 border-game-gold/30 hover:border-game-gold text-game-gold flex items-center gap-4 group shadow-2xl backdrop-blur-xl w-full"
        >
          <div className="w-8 h-8 rounded-lg bg-game-gold/10 flex items-center justify-center group-hover:bg-game-gold/20 transition-all">
             <Users size={18} className="group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-black text-xs uppercase tracking-[0.3em]">Characters</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/maze')}
          className="game-panel px-6 py-3 bg-black/60 border-game-blue/30 hover:border-game-blue text-game-blue flex items-center gap-4 group shadow-2xl backdrop-blur-xl w-full"
        >
          <div className="w-8 h-8 rounded-lg bg-game-blue/10 flex items-center justify-center group-hover:bg-game-blue/20 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span className="font-black text-xs uppercase tracking-[0.3em]">Maze</span>
        </motion.button>
      </div>

      {/* 1. TOP-RIGHT: User Card & Auth Buttons */}
      <div className="absolute top-24 right-16 z-30 flex flex-col items-end gap-3">
        {mounted && (
          <>
            <UserCard />
            
            {user?.is_guest && (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/auth')}
                  className="px-4 py-1.5 bg-white/5 hover:bg-game-gold hover:text-black border border-white/10 rounded-lg backdrop-blur-xl transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    <span className="text-[9px] font-black uppercase tracking-widest">Login</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/auth')}
                  className="px-4 py-1.5 bg-game-blue/20 hover:bg-game-blue text-white border border-game-blue/30 rounded-lg backdrop-blur-xl transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    <span className="text-[9px] font-black uppercase tracking-widest">Register</span>
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 2. TOP-CENTER: Logo Section */}
      <div className="absolute top-[120px] left-1/2 -translate-x-1/2 z-20 text-center w-full">
        <GameLogo />
      </div>

      {/* 3. MIDDLE SECTION: Main Menu Buttons */}
      <div className="absolute top-[380px] left-1/2 -translate-x-1/2 z-20 flex items-start justify-center w-full max-w-7xl">
        <div className="flex-shrink-0">
          <MainMenuButtons />
        </div>
      </div>

      {/* 6. RIGHT SIDE PANEL: MVP Mode info */}
      <div className="absolute top-[380px] right-16 z-20 hidden xl:block">
        <MvpModePanel />
      </div>

      {/* 4. BOTTOM SECTION: Latest Update */}
      <div className="absolute bottom-[100px] left-16 z-20">
        <LatestUpdatePanel />
      </div>

      {/* AMBIENT PARTICLES */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              initial={{ x: Math.random() * 2000, y: 1100, opacity: 0 }}
              animate={{ y: -100, opacity: [0, 0.4, 0] }}
              transition={{ duration: 10 + Math.random() * 15, repeat: Infinity, delay: Math.random() * 5 }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
