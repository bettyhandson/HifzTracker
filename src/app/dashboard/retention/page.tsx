'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { BrainCircuit, Search, Flame, ArrowRight, TrendingUp, Sparkles, ChevronLeft, CheckCircle2, Target, Info } from "lucide-react";
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
      const logDate = new Date(log.created_at);
      if (logDate > stats[log.surah_number].lastRead) stats[log.surah_number].lastRead = logDate;
      stats[log.surah_number].totalsessions++;
    });

    return Object.values(stats)
      .map(s => {
        const diffDays = Math.floor((today.getTime() - s.lastRead.getTime()) / (1000 * 60 * 60 * 24));
        const threshold = s.totalsessions >= 5 ? 7 : 2;
        const status = diffDays >= (threshold + 3) ? 'Critical' : diffDays >= threshold ? 'Due' : 'Healthy';
        const mastery = s.totalsessions >= 10 ? 'Legendary' : s.totalsessions >= 5 ? 'Mastered' : 'Learning';
        
        return { ...s, daysAgo: diffDays, threshold, status, mastery };
      })
      .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.daysAgo - a.daysAgo);
  }, [logs, search]);

  const overallHealth = useMemo(() => {
    if (surahStats.length === 0) return 0;
    const weak = surahStats.filter(s => s.daysAgo >= s.threshold).length;
    return Math.round(((surahStats.length - weak) / surahStats.length) * 100);
  }, [surahStats]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#020617] pb-24">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-500/20 to-transparent pt-6 pb-8 px-6">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <BrainCircuit className="h-32 w-32 text-emerald-500" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-emerald-500">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Adaptive Engine v2.0</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
            Retention <br/> <span className="text-emerald-500">Command Center</span>
          </h1>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-6 -mt-4 relative z-20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <Input 
            placeholder="Search memory map..." 
            className="h-14 pl-12 bg-[#0a0a0a] border-white/5 rounded-2xl text-white placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tactical Stats */}
      <div className="px-6 mt-8 grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 h-36 flex flex-col justify-between">
           <TrendingUp className="h-6 w-6 text-emerald-500" />
           <div>
             <p className="text-[10px] font-black uppercase text-emerald-500/60 mb-1">True Health</p>
             <p className="text-4xl font-black text-white italic leading-none">{overallHealth}%</p>
           </div>
        </div>
        
        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 h-36 flex flex-col justify-between">
           <Flame className="h-6 w-6 text-orange-500" />
           <div>
             <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Tracked</p>
             <p className="text-4xl font-black text-white italic leading-none">{surahStats.length}</p>
           </div>
        </div>
      </div>

      {/* Individual Surah Map Section */}
      <div className="px-6 mt-10 space-y-6">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Individual Surah Map</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {surahStats.length > 0 ? (
            surahStats.map((s) => (
              <div 
                key={s.id} 
                className={`p-5 rounded-[2.2rem] border transition-all flex items-center justify-between group ${
                  s.mastery === 'Legendary' ? 'bg-gradient-to-br from-yellow-500/5 to-transparent border-yellow-500/20' : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-sm font-black border relative ${
                    s.status === 'Critical' ? 'text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
                    s.status === 'Due' ? 'text-orange-400 border-orange-500/20' : 
                    'text-emerald-500 border-emerald-500/20'
                  }`}>
                    {s.id}
                    {s.mastery !== 'Learning' && (
                      <div className="absolute -top-1 -right-1 bg-[#020617] p-1 rounded-full border border-inherit shadow-lg">
                         {s.mastery === 'Legendary' ? <Sparkles className="h-2.5 w-2.5 text-yellow-500" /> : <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black text-white italic leading-tight tracking-tight">{s.name}</p>
                      {s.mastery === 'Legendary' && (
                        <span className="text-[7px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Legendary</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-white/5 text-slate-500">
                        {s.totalsessions} sessions
                      </span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                        s.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {s.daysAgo === 0 ? 'Recently Read' : `${s.daysAgo}d Gap`}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => router.push('/dashboard/recite')} className="h-12 w-12 rounded-2xl bg-white/5 text-slate-500 group-hover:text-emerald-500 transition-all">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            ))
          ) : (
            /* 🚀 PROFESSIONAL EMPTY STATE & LOGIC GUIDE */
            <div className="space-y-8 py-4">
              <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 border-dashed text-center space-y-4">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-slate-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold italic">No Memory Data Yet</p>
                  <p className="text-slate-500 text-xs px-4">Log your first recitation to start building your tactical memory map.</p>
                </div>
                <Button 
                  onClick={() => router.push('/dashboard/recite')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-[#020617] font-black rounded-xl px-6"
                >
                  START LOGGING
                </Button>
              </div>

              {/* Instructional Logic Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Info className="h-3 w-3 text-emerald-500" />
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">How the Engine v2.0 Works</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter italic">01. Adaptive Thresholds</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      New surahs require revision every <span className="text-emerald-500 font-bold">2 days</span>. Once you log a surah 5 times, the engine trusts your memory and expands the window to <span className="text-emerald-500 font-bold">7 days</span>.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter italic">02. Mastery Levels</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Build consistency to unlock badges. <span className="text-emerald-500 font-bold">Mastered</span> (5+ logs) unlocks a green shield, while <span className="text-yellow-500 font-bold">Legendary</span> (10+ logs) grants a golden glow.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter italic">03. True Health Score</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Your percentage is calculated based on how many surahs are currently within their "Healthy" window vs. those that are <span className="text-orange-500 font-bold">Due</span> or <span className="text-red-500 font-bold">Critical</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}