'use client';

import { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, ChevronRight, ChevronLeft, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MiniPlayer() {
  const { isPlaying, activeAyahIndex, playlist, toggleAudio } = useAudio();
  const [isMinimized, setIsMinimized] = useState(false);

  if (activeAyahIndex === null) return null;
  const currentAyah = playlist[activeAyahIndex];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: isMinimized ? 'calc(100% - 50px)' : 0, opacity: 1 }}
        className="fixed bottom-24 right-4 left-4 z-[100] md:left-auto md:w-80"
      >
        <div className="bg-[#121212]/95 border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center gap-3 relative overflow-hidden">
          
          {/* 🚀 Side-Toggle Handle */}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-white/5 hover:bg-white/10"
          >
            {isMinimized ? <ChevronLeft className="h-4 w-4 text-emerald-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
          </button>

          <div className={`flex items-center justify-between w-full ml-8 transition-opacity ${isMinimized ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Music className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Reciting</h4>
                <p className="text-xs text-white truncate w-32">Ayah {currentAyah?.numberInSurah}</p>
              </div>
            </div>

            <button 
              onClick={toggleAudio}
              className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}