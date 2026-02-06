'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { BrainCircuit, Search, Flame, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, Sparkles, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SURAHS } from '@/lib/quran';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function RetentionPage({ userId }: { userId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      let data = [];
      if (userId === 'guest') {
        data = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
      } else if (userId) {
        const { data: cloudData } = await supabase
          .from('progress_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        data = cloudData || [];
      }
      setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, [userId]);

  const surahStats = useMemo(() => {
    const stats: Record<number, any> = {};
    const today = new Date();
    today.setHours(0,0,0,0);

    logs.forEach(log => {
      if (!stats[log.surah_number]) {
        const surahInfo = SURAHS.find(s => s.id === log.surah_number);
        stats[log.surah_number] = {
          id: log.surah_number,
          name: surahInfo?.name || `Surah ${log.surah_number}`,
          lastRead: new Date(log.created_at),
          totalsessions: 0
        };
      }
      stats[log.surah_number].totalsessions++;
    });

    return Object.values(stats)
      .map(s => {
        const diffDays = Math.floor((today.getTime() - s.lastRead.getTime()) / (1000 * 60 * 60 * 24));
        return { ...s, daysAgo: diffDays };
      })
      .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.daysAgo - a.daysAgo);
  }, [logs, search]);

  const overallHealth = useMemo(() => {
    if (surahStats.length === 0) return 100;
    const weak = surahStats.filter(s => s.daysAgo >= 2).length;
    return Math.round(((surahStats.length - weak) / surahStats.length) * 100);
  }, [surahStats]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#020617] pb-24">
      {/* 🚀 Professional Game Zone Style Header with Back Navigation */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-500/20 to-transparent pt-6 pb-8 px-6">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <BrainCircuit className="h-32 w-32 text-emerald-500" />
        </div>
        
        <div className="relative z-10 space-y-4">
          {/* Top Bar with Back Button */}
          <div className="flex items-center justify-between mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-emerald-500 hover:bg-emerald-500/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Memory Engine v1.0</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
            Retention <br/> <span className="text-emerald-500">Command Center</span>
          </h1>
          
          <p className="text-slate-400 text-xs font-medium max-w-[280px]">
            Strategically track your revision cycles and master your Quranic memory.
          </p>
        </div>
      </div>

      {/* 🚀 Search Bar (Professional Floating Style) */}
      <div className="px-6 -mt-4 relative z-20">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Search surah memory..." 
            className="h-14 pl-12 bg-[#0a0a0a] border-white/5 rounded-2xl text-white placeholder:text-slate-700 focus:ring-emerald-500/50 shadow-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🚀 Tactical Stats Cards */}
      <div className="px-6 mt-8 grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between h-36 relative overflow-hidden group">
           <div className="absolute -right-2 -top-2 opacity-5 group-hover:scale-110 transition-transform">
             <TrendingUp className="h-16 w-16 text-emerald-500" />
           </div>
           <TrendingUp className="h-6 w-6 text-emerald-500" />
           <div>
             <p className="text-[10px] font-black uppercase text-emerald-500/60 mb-1">Overall Health</p>
             <p className="text-4xl font-black text-white italic leading-none">{overallHealth}%</p>
           </div>
        </div>
        
        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-between h-36 relative overflow-hidden group">
           <div className="absolute -right-2 -top-2 opacity-5 group-hover:scale-110 transition-transform">
             <Flame className="h-16 w-16 text-orange-500" />
           </div>
           <Flame className="h-6 w-6 text-orange-500" />
           <div>
             <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Surahs Tracked</p>
             <p className="text-4xl font-black text-white italic leading-none">{surahStats.length}</p>
           </div>
        </div>
      </div>

      {/* 🚀 The Memory Map List */}
      <div className="px-6 mt-10 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Individual Surah Map</h3>
          <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {surahStats.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-slate-500 text-sm italic">No logs found. Start your journey.</p>
            </div>
          ) : (
            surahStats.map((s) => (
              <div 
                key={s.id} 
                className="p-5 rounded-[2.2rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-sm font-black border transition-all ${
                    s.daysAgo >= 5 ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                    s.daysAgo >= 2 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_20px_rgba(251,146,60,0.1)]' : 
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  }`}>
                    {s.id}
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="text-lg font-black text-white italic tracking-tight">{s.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                        s.daysAgo >= 2 ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {s.daysAgo === 0 ? 'Recently Read' : s.daysAgo === 1 ? 'Read Yesterday' : `${s.daysAgo} Days Gap`}
                      </span>
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{s.totalsessions} sessions</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.push('/dashboard/recite')}
                  className="h-12 w-12 rounded-2xl bg-white/5 text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}