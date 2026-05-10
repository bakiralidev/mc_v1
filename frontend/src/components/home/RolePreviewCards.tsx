'use client';

import { motion } from 'framer-motion';

const roles = [
  { id: 'warrior', name: 'WARRIOR', subtitle: 'Frontline Fighter', color: 'border-red-500/40', glow: 'shadow-red-500/20', bg: 'bg-red-500/5', icon: '🛡️' },
  { id: 'archer', name: 'ARCHER', subtitle: 'Ranged Striker', color: 'border-green-500/40', glow: 'shadow-green-500/20', bg: 'bg-green-500/5', icon: '🏹' },
  { id: 'healer', name: 'HEALER', subtitle: 'Support & Sustain', color: 'border-blue-500/40', glow: 'shadow-blue-500/20', bg: 'bg-blue-500/5', icon: '✨' },
  { id: 'mage', name: 'MAGE', subtitle: 'Magic Damage', color: 'border-purple-500/40', glow: 'shadow-purple-500/20', bg: 'bg-purple-500/5', icon: '🧙' },
];

export default function RolePreviewCards() {
  return (
    <div className="flex gap-4 p-2 items-end">
      {roles.map((role, i) => (
        <motion.div
          key={role.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 + (i * 0.1) }}
          whileHover={{ y: -8, scale: 1.05 }}
          className={`relative w-[160px] h-[180px] rounded-2xl border-2 ${role.color} ${role.bg} backdrop-blur-md shadow-2xl ${role.glow} flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all duration-300 overflow-hidden`}
        >
          {/* Decorative background glow */}
          <div className={`absolute top-0 inset-x-0 h-1/2 opacity-20 bg-gradient-to-b from-white to-transparent`}></div>

          <div className="text-5xl group-hover:scale-125 transition-transform duration-500 z-10">{role.icon}</div>
          
          <div className="flex flex-col items-center z-10">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white">{role.name}</span>
            <span className="text-[9px] font-bold text-text-dim uppercase tracking-tighter mt-0.5">{role.subtitle}</span>
          </div>
          
          {/* Selection indicator */}
          <div className={`absolute bottom-0 inset-x-0 h-1.5 ${role.id === 'warrior' ? 'bg-red-500' : role.id === 'archer' ? 'bg-green-500' : role.id === 'healer' ? 'bg-blue-500' : 'bg-purple-500'} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
        </motion.div>
      ))}
    </div>
  );
}
