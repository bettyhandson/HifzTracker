'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; // 🚀 Added hooks for timer
import { BookOpen, Clock } from 'lucide-react'; // 🚀 Added Clock icon
import { Button } from '@/components/ui/button';

interface FocusShieldProps {
  isActive: boolean;
  targetGoal: string;
  endTime?: string; // 🚀 Pass the end_time from your Supabase session
}

export default function FocusShield({ isActive, targetGoal, endTime }: FocusShieldProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!isActive || !endTime) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(endTime).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    // Initial calculation
    calculateTime();
    
    // Update every second
    const timer = setInterval(calculateTime, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, endTime]);

  if (!isActive) return null;

  const handleNavigation = () => {
    router.replace('/dashboard/recite'); 
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
        <BookOpen className="h-16 w-16 text-emerald-500 relative z-10" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">
        Hifz Mode is Active
      </h1>

      {/* 🚀 New Countdown Display */}
      {timeLeft && (
        <div className="flex items-center gap-2 justify-center mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <Clock className="h-4 w-4 text-emerald-500" />
          <span className="text-xl font-mono font-bold text-emerald-400 tracking-wider">
            {timeLeft}
          </span>
        </div>
      )}
      
      <p className="text-gray-400 max-w-xs mb-10 leading-relaxed">
        You committed to memorize <span className="text-emerald-400 font-bold">{targetGoal}</span>. 
        Finish your portion to unlock other pages.
      </p>

      <Button 
        onClick={handleNavigation}
        className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-transform"
      >
        Open Quran Reader
      </Button>

      <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest font-bold opacity-50">
        Consistency is the key to Hifz
      </p>
    </div>
  );
}