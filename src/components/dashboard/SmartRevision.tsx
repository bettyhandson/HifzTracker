'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Flame, ArrowRight, BrainCircuit, Target, Share2, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { SURAHS } from '@/lib/quran';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface RevisionItem {
  surah: number;
  surahName: string;
  daysAgo: number;
  lastRead: string;
  isUrgent: boolean;
  sessions: number;
}

export default function SmartRevision({ userId }: { userId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [revisionList, setRevisionList] = useState<RevisionItem[]>([]);
  const [retentionScore, setRetentionScore] = useState(100);
  const [nextSuggested, setNextSuggested] = useState<{id: number, name: string} | null>(null);
  const [totalTracked, setTotalTracked] = useState(0);

  const processData = (logs: any[]) => {
    const statsMap: Record<number, { lastRead: string, count: number }> = {};
    let maxSurahId = 0;

    logs.forEach((log) => {
      const current = new Date(log.created_at).getTime();
      if (!statsMap[log.surah_number]) {
        statsMap[log.surah_number] = { lastRead: log.created_at, count: 0 };
      }
      const existing = new Date(statsMap[log.surah_number].lastRead).getTime();
      if (current > existing) statsMap[log.surah_number].lastRead = log.created_at;
      
      statsMap[log.surah_number].count += 1;
      if (log.surah_number > maxSurahId) maxSurahId = log.surah_number;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const needsReview: RevisionItem[] = [];
    const trackedCount = Object.keys(statsMap).length;
    setTotalTracked(trackedCount);
    let weakPoints = 0;

    Object.keys(statsMap).forEach((surahStr) => {
      const surahId = parseInt(surahStr);
      const data = statsMap[surahId];
      const lastReadDate = new Date(data.lastRead);
      lastReadDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today.getTime() - lastReadDate.getTime()) / (1000 * 60 * 60 * 24)); 
      const threshold = data.count >= 5 ? 7 : 2;

      if (diffDays >= threshold) {
        weakPoints += (data.count >= 5 ? 0.5 : 1);
        const surahInfo = SURAHS.find(s => s.id === surahId);
        needsReview.push({ 
          surah: surahId, 
          surahName: surahInfo?.name || `Surah ${surahId}`,
          daysAgo: diffDays, 
          lastRead: data.lastRead,
          isUrgent: diffDays >= (threshold + 2),
          sessions: data.count
        });
      }
    });

    if (maxSurahId < 114) {
      const next = SURAHS.find(s => s.id === maxSurahId + 1);
      if (next) setNextSuggested(next);
    }

    const score = trackedCount > 0 ? Math.max(0, Math.round(((trackedCount - weakPoints) / trackedCount) * 100)) : 100;
    setRetentionScore(score);

    return needsReview.sort((a, b) => b.daysAgo - a.daysAgo).slice(0, 3);
  };

  useEffect(() => {
    async function fetchHistory() {
      let logs = [];
      if (userId === 'guest') {
        logs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
      } else if (userId) {
        const { data } = await supabase.from('progress_logs').select('surah_number, created_at').eq('user_id', userId);
        logs = data || [];
      }
      setRevisionList(processData(logs));
      setLoading(false);
    }
    fetchHistory();
  }, [userId]);

  const handleShare = async () => {
    const status = retentionScore >= 90 ? "Excellent ✅" : retentionScore >= 70 ? "Good 📈" : "Needs Focus ⚠️";
    const text = `📖 *HifzTracker Progress Report*\n\n🏆 Retention Score: ${retentionScore}%\n📊 Status: ${status}\n📚 Surahs Tracked: ${totalTracked}\n\nJoin me on HifzTracker to master your Quranic consistency!\n🔗 https://optimistcx.space`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Hifz Progress', text: text });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
      } 
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      toast.error("Unable to share");
    }
  };

  if (loading) return null;

  return (
    <Card className="border-white/5 bg-[#0a0a0a] overflow-hidden relative group p-6 rounded-[2.5rem]">
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all rotate-12">
        <BrainCircuit className="h-40 w-40 text-emerald-500" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-white font-black text-xl italic tracking-tight flex items-center gap-2">
              <Flame className={`h-5 w-5 ${retentionScore < 70 ? 'text-orange-500 animate-pulse' : 'text-emerald-500'}`} />
              Stability
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Adaptive Memory Score</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-xl bg-white/5 text-slate-400 hover:text-emerald-500 h-10 w-10">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/retention')} className="rounded-xl bg-white/5 text-slate-400 hover:text-emerald-500 h-10 w-10">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
             <span className="text-slate-500">Brain Strength</span>
             <span className={retentionScore < 70 ? 'text-orange-500' : 'text-emerald-500'}>{retentionScore}%</span>
          </div>
          <Progress value={retentionScore} className="h-2 bg-white/5" />
        </div>

        {revisionList.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" /> Priority Revision
            </p>
            {revisionList.map((item) => (
              <div key={item.surah} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black border ${item.isUrgent ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                    {item.surah}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white tracking-tight">{item.surahName}</p>
                      {item.sessions >= 10 ? <Sparkles className="h-3 w-3 text-yellow-500" /> : item.sessions >= 5 ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : null}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium tracking-wide">{item.daysAgo}d gap • {item.sessions} logs</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => router.push('/dashboard/recite')} className="rounded-full hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-500">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4">
             <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
             <p className="text-xs text-slate-300 font-medium">Memory <span className="text-emerald-400 font-bold italic">Optimized</span>. Focus on new surahs.</p>
          </div>
        )}
        
        <Button variant="ghost" onClick={() => router.push('/dashboard/retention')} className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500">
          Explore Detailed Memory Map
        </Button>
      </div>
    </Card>
  );
}