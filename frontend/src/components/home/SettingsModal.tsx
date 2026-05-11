'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Monitor, Volume2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { cameraMode, setCameraMode } = useGameStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-game-blue/20 flex items-center justify-center">
                  <Monitor size={20} className="text-game-blue" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest text-white">Settings</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Camera Mode */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/40">
                  <Camera size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gameplay Camera</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCameraMode('THIRD_PERSON')}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      cameraMode === 'THIRD_PERSON' 
                        ? 'bg-game-blue/20 border-game-blue text-white' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
                      <Monitor size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Third Person</span>
                  </button>

                  <button 
                    onClick={() => setCameraMode('FIRST_PERSON')}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      cameraMode === 'FIRST_PERSON' 
                        ? 'bg-game-blue/20 border-game-blue text-white' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
                      <Camera size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">First Person</span>
                  </button>
                </div>
                <p className="text-[10px] text-white/30 font-medium">You can also switch mode during match by pressing <span className="text-game-gold">V</span></p>
              </div>

              {/* Sound Placeholder */}
              <div className="space-y-4 opacity-50">
                <div className="flex items-center gap-2 text-white/40">
                  <Volume2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audio Volume</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-3/4 bg-game-blue"></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white/5 border-t border-white/5">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-xl hover:bg-game-gold transition-all"
              >
                Close Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
