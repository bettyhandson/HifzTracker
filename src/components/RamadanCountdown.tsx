'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // 🌙 Added for the floating effect

const RAMADAN_2026 = new Date('2026-02-18T00:00:00').getTime();

export default function RamadanCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = RAMADAN_2026 - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-slate-900/40 border border-emerald-500/10 backdrop-blur-md">
      
      {/* 🌙 Floating Moon Logic */}
      <motion.div
        animate={{ 
          y: [0, -12, 0], 
          rotate: [0, 5, 0],
          filter: ["drop-shadow(0 0 8px #10b981)", "drop-shadow(0 0 20px #10b981)", "drop-shadow(0 0 8px #10b981)"]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="text-6xl cursor-default"
      >
        🌙
      </motion.div>

      <div className="flex justify-center gap-2 md:gap-4 text-white">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            {/* ⚡ Breathing Glow Box */}
            <motion.div 
              animate={{ borderColor: ["rgba(16,185,129,0.2)", "rgba(16,185,129,0.5)", "rgba(16,185,129,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-emerald-500/10 border rounded-xl w-14 h-14 md:w-20 md:h-20 flex items-center justify-center mb-1 shadow-lg shadow-emerald-500/5"
            >
              <span className="text-xl md:text-3xl font-black text-emerald-500">
                {String(value).padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-bold">
              {label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-emerald-400/80 text-[10px] uppercase tracking-[0.2em] font-medium">
        Preparation for the Blessed Month
      </p>
    </div>
  );
}