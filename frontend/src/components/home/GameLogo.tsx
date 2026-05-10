'use client';

import { motion } from 'framer-motion';

export default function GameLogo() {
  return (
    <motion.div 
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center select-none"
    >
      <div className="relative">
        <h1 className="text-[clamp(3rem,5vw,5rem)] font-black italic tracking-tight leading-[0.85] bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#b45309] bg-clip-text text-transparent drop-shadow-[0_6px_0_rgb(69,26,3)] text-center px-6">
          MAZE
          <br />
          CHAMPIONS
        </h1>
        <div className="absolute -inset-8 bg-game-gold/5 blur-[60px] -z-10 animate-pulse"></div>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-xs md:text-sm font-black uppercase tracking-[0.4em] text-white/80 whitespace-nowrap"
      >
        Battle • Survive • Conquer
      </motion.p>
    </motion.div>
  );
}
