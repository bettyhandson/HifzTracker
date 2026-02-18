'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Ramadan started today, Feb 18, 2026
const RAMADAN_START_2026 = new Date('2026-02-18T00:00:00').getTime();

export default function RamadanCounter() {
  const [ramadanDay, setRamadanDay] = useState(1);

  useEffect(() => {
    const calculateDay = () => {
      const now = new Date().getTime();
      const diffInMs = now - RAMADAN_START_2026;
      
      // Calculate current day (Day 1, Day 2, etc.)
      const currentDay = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
      
      // Ensure we don't go past 30 days
      setRamadanDay(Math.min(Math.max(currentDay, 1), 30));
    };

    calculateDay();
    // Update every hour to check if the day has rolled over
    const timer = setInterval(calculateDay, 3600000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-slate-900/40 border border-emerald-500/10 backdrop-blur-md">
      
      {/* 🌙 Floating Moon with Enhanced Glow for Ramadan */}
      <motion.div
        animate={{ 
          y: [0, -12, 0], 
          scale: [1, 1.1, 1],
          filter: ["drop-shadow(0 0 10px #10b981)", "drop-shadow(0 0 25px #10b981)", "drop-shadow(0 0 10px #10b981)"]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="text-7xl cursor-default"
      >
        🌙
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-white text-sm uppercase tracking-[0.3em] font-bold opacity-70">
          Current Day
        </h2>
        
        <div className="flex items-baseline gap-1">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl px-8 py-4 flex items-center justify-center shadow-xl shadow-emerald-500/10"
          >
            <span className="text-5xl md:text-7xl font-black text-emerald-500">
              {ramadanDay}
            </span>
          </motion.div>
          <span className="text-emerald-500/50 font-bold text-xl">/ 30</span>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] font-bold">
          Ramadan Kareem
        </p>
        <p className="text-slate-400 text-[10px] max-w-[200px] leading-relaxed italic">
          "The month of Ramadan in which was revealed the Quran..." (2:185)
        </p>
      </div>
    </div>
  );
}