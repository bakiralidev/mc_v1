'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';
import { Sword, Users, User, Settings, ArrowRight, X } from 'lucide-react';

export default function MainMenuButtons() {
  const router = useRouter();
  const { token, setToken, setUser } = useAuthStore();
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [lobbyCode, setLobbyCode] = useState('');

  const ensureAuth = async () => {
    if (!token) {
      const { data } = await api.post('/auth/guest');
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    return true;
  };

  const handlePlay = async () => {
    try {
      await ensureAuth();
      const { data: lobby } = await api.post('/lobby/create');
      router.push(`/lobby/${lobby.lobby_code}`);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lobbyCode) return;
    try {
      await ensureAuth();
      // Avval lobbiga qo'shilish so'rovini yuboramiz
      await api.post('/lobby/join', { code: lobbyCode.toUpperCase() });
      // Keyin sahifaga o'tamiz
      router.push(`/lobby/${lobbyCode.toUpperCase()}`);
    } catch (err: any) {
      console.error("Failed to join lobby", err);
      alert(err.response?.data?.message || "Lobby not found or full");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[14px] w-[360px]"
    >
      {/* PLAY BUTTON (1) */}
      <motion.button 
        variants={item}
        onClick={handlePlay}
        className="game-btn-gold h-[58px] w-full flex items-center justify-center gap-4 group relative overflow-hidden shadow-[0_10px_30px_rgba(251,191,36,0.2)] -translate-x-24"
      >
        <Sword size={22} className="transition-transform group-hover:rotate-12 opacity-80" />
        <span className="text-[15px] font-black italic tracking-[0.2em]">PLAY</span>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </motion.button>

      {/* JOIN BY CODE / INPUT (2) */}
      <AnimatePresence mode="wait">
        {!showJoinInput ? (
          <motion.button 
            key="join-btn"
            variants={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setShowJoinInput(true)}
            className="game-btn-blue h-[58px] w-full flex items-center justify-center gap-4 group border-white/5 translate-x-24"
          >
            <Users size={22} className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <span className="text-[13px] font-black tracking-[0.2em]">JOIN BY CODE</span>
          </motion.button>
        ) : (
          <motion.form 
            key="join-input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleJoin}
            className="relative h-[58px] w-full flex items-center translate-x-24"
          >
            <input 
              autoFocus
              type="text"
              placeholder="ENTER CODE..."
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value)}
              className="w-full h-full bg-game-blue/20 border-2 border-game-blue/40 rounded-xl px-6 pr-24 text-white font-black tracking-[0.3em] outline-none focus:border-game-blue transition-all uppercase placeholder:text-white/20"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button 
                type="submit"
                className="w-10 h-10 flex items-center justify-center bg-game-blue rounded-lg text-white hover:bg-blue-400 transition-colors"
              >
                <ArrowRight size={20} />
              </button>
              <button 
                type="button"
                onClick={() => setShowJoinInput(false)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-[12px]">
        {[
          { icon: User, label: 'PROFILE / STATS', offset: '-translate-x-24' },
          { icon: Settings, label: 'SETTINGS', offset: 'translate-x-24' }
        ].map((btn, i) => (
          <motion.button 
            key={i}
            variants={item}
            className={`game-btn-blue h-[58px] w-full flex items-center justify-center gap-4 group hover:bg-game-blue/20 transition-all border-white/5 ${btn.offset}`}
          >
            <btn.icon size={22} className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <span className="text-[13px] font-black tracking-[0.2em]">{btn.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
