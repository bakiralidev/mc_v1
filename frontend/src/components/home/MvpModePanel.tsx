'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Sword, Zap } from 'lucide-react';

export default function MvpModePanel() {
  const features = [
    { icon: Shield, label: 'GAME MODE', value: 'SURVIVAL', color: 'text-blue-400' },
    { icon: Users, label: 'PLAYERS', value: '2 – 12 PLAYERS', color: 'text-purple-400' },
    { icon: Sword, label: 'MAIN TASK', value: 'LAST TEAM ALIVE', color: 'text-orange-400' },
  ];

  return (
    <motion.div 
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="game-panel p-8 bg-black/70 border-purple-500/20 w-[300px] min-h-[300px] relative overflow-hidden flex flex-col justify-between"
    >
      {/* Glow background */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 blur-[50px]"></div>

      <div>
        <div className="space-y-7">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${f.color} shadow-inner`}>
                <f.icon size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">{f.label}</span>
                <span className="text-sm font-black text-white uppercase tracking-tight">{f.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-white/5 text-center">
        <span className="text-[10px] font-black text-text-dim/40 uppercase tracking-[0.4em]">Matchmaking: Fast & Secure</span>
      </div>
    </motion.div>
  );
}
