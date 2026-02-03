'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AchievementPopup({ isOpen, onClose, streak }: { isOpen: boolean, onClose: () => void, streak: number }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-slate-900 border border-emerald-500/30 p-8 rounded-[2rem] shadow-2xl shadow-emerald-500/10 max-w-sm w-full text-center overflow-hidden"
          >
            {/* Background Sparkle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <Trophy className="h-10 w-10 text-emerald-500" />
              </div>
              
              <h2 className="text-2xl font-black text-white tracking-tighter mb-2">
                {streak} Day Streak!
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Jazakumullahu Khayran! Your spiritual momentum is inspiring. Consistency is the path to Hifz.
              </p>

              <div className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 rounded-2xl font-bold gap-2">
                  <Share2 className="h-4 w-4" /> Share Achievement
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full text-slate-500 hover:text-white">
                  Continue Journey
                </Button>
              </div>
            </div>
            
            <Sparkles className="absolute bottom-4 right-4 h-6 w-6 text-emerald-500/20" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}