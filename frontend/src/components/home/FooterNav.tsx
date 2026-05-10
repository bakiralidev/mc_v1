'use client';

import { useAuthStore } from '@/store/authStore';
import { Newspaper, Trophy, ShoppingBag, HelpCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FooterNav() {
  const { logout } = useAuthStore();

  const navItems = [
    { icon: Newspaper, label: 'NEWS' },
    { icon: Trophy, label: 'LEADERBOARD' },
    { icon: ShoppingBag, label: 'STORE' },
    { icon: HelpCircle, label: 'HELP' },
  ];

  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full h-[58px] flex items-center justify-between px-10 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Left Navigation */}
      <div className="flex items-center gap-10">
        {navItems.map((item) => (
          <button 
            key={item.label}
            className="flex items-center gap-3 text-text-dim hover:text-white transition-all group"
          >
            <item.icon size={18} className="group-hover:scale-110 group-hover:text-game-blue transition-all" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Right Navigation: Exit */}
      <button 
        onClick={logout}
        className="flex items-center gap-3 px-6 py-2 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition-all group"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">EXIT GAME</span>
        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
