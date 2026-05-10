'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function LatestUpdatePanel() {
  const updates = [
    'Lobby Code Matchmaking',
    '4 Unique Roles & Skills',
    'Classic Maze-Map v1.0',
  ];

  return (
    <motion.div 
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="game-panel p-7 bg-black/70 border-emerald-500/20 w-[320px] min-h-[220px] flex flex-col justify-between"
    >
      <div>
        <h3 className="text-xl font-black italic tracking-tighter text-white mb-6 flex items-center gap-3">
          <Calendar className="text-emerald-500" size={22} />
          LATEST UPDATE
        </h3>

        <div className="space-y-4">
          {updates.map((update, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <CheckCircle2 size={16} className="text-emerald-500/60 group-hover:text-emerald-500 transition-colors" />
              <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{update}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-center animate-pulse">
          ⚡ PLAY NOW FOR +50 XP BONUS
        </p>
      </div>
    </motion.div>
  );
}
