'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Activity, ArrowRight, UserCircle, RefreshCw } from "lucide-react"; // Changed WifiOff to UserCircle
import RamadanCountdown from "../RamadanCountdown";

export default function Hero() {
  const router = useRouter();

  // 🚀 Logic: Initialize Guest Data & Redirect (Preserved)
  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const existingData = localStorage.getItem('hifz_tracker_data');

    if (!existingData) {
      const initialGuestData = {
        isGuest: true,
        lastSurah: 'Al-Fatiha',
        totalAyahs: 0,
        streak: 1,
        joinedAt: new Date().toISOString()
      };
      localStorage.setItem('hifz_tracker_data', JSON.stringify(initialGuestData));
    }

    router.push('/dashboard');
  };

  return (
    <section className="relative overflow-hidden bg-[#020617] py-20 sm:py-32">
      {/* 1. Enhanced Ambient Lighting */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* 2. Modern Glassmorphic Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-400 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The #1 Hifz Tool for Ramadan 2026</span>
          </div>

          {/* 3. The Countdown */}
          {/* <div className="w-full mb-12 scale-90 sm:scale-100 transition-transform">
             <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-6">Maximize Every Moment</h2>
             <RamadanCountdown />
          </div> */}

          {/* 4. Responsive Typography */}
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl leading-[1.1]">
            Secure Your Journey
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400">
              To Eternity.
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl font-medium">
            More than just a tracker. <span className="text-emerald-400">HifzTracker</span> combines smart revision algorithms, visual heatmaps, and instant guest logging to help you memorize the Quran—and keep it.
          </p>

          {/* 5. CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="h-14 rounded-2xl bg-emerald-500 px-8 text-base font-bold text-slate-950 hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]" 
            >
              Start Tracking Free
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 rounded-2xl border-white/10 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm hover:bg-white/10 transition-all" 
              asChild
            >
              <Link href="#features" className="flex items-center gap-2">
                See Features <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* 6. Feature Cards (Redefined Content) */}
          <div className="mt-24 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
            {[
              { 
                label: 'Smart Muraja\'ah', 
                icon: RefreshCw, 
                desc: 'Automated revision alerts so you never forget a Surah again.',
                color: 'text-amber-400',
                bg: 'bg-amber-400/10'
              },
              { 
                label: 'Visual Heatmaps', 
                icon: Activity, 
                desc: 'Visualize your dedication with beautiful daily activity heatmaps.', // 🚀 Redefined
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10'
              },
              { 
                label: 'Guest Mode', // 🚀 Renamed from 'Offline First'
                icon: UserCircle,    // 🚀 Changed Icon
                desc: 'Start logging instantly without an account. Your data is saved locally until you decide to sync.', // 🚀 Redefined
                color: 'text-blue-400',
                bg: 'bg-blue-400/10'
              },
            ].map((item, i) => (
              <div 
                key={item.label} 
                className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-8 text-left transition-all hover:bg-white/[0.02] hover:border-white/10"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ${item.color} mb-6 transition-transform group-hover:scale-110`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-white text-xl mb-3">{item.label}</h3>
                <p className="text-sm leading-relaxed text-slate-400 font-medium">{item.desc}</p>
                
                {/* Hover Glow Effect */}
                <div className={`absolute -bottom-4 -right-4 h-32 w-32 ${item.bg} blur-[60px] transition-opacity opacity-0 group-hover:opacity-100`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}