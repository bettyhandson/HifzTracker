'use client';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FocusShield({ isActive, targetGoal }: { isActive: boolean, targetGoal: string }) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
        <BookOpen className="h-16 w-16 text-emerald-500 relative z-10" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">
        Hifz Mode is Active
      </h1>
      
      <p className="text-gray-400 max-w-xs mb-10 leading-relaxed">
        You committed to reciting <span className="text-emerald-400 font-bold">{targetGoal}</span>. 
        Finish your portion to unlock your other pages.
      </p>

      <Button 
        onClick={() => window.location.href = '/dashboard/recite'}
        className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/20"
      >
        Open HifzTracker
      </Button>

      <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
        Consistency is the key to Hifz
      </p>
    </div>
  );
}