'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Flame, ArrowRight, BrainCircuit, Target, Share2, BarChart3 } from "lucide-react";
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
}

export default function SmartRevision({ userId }: { userId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [revisionList, setRevisionList] = useState<RevisionItem[]>([]);
  const [retentionScore, setRetentionScore] = useState(100);
  const [nextSuggested, setNextSuggested] = useState<{id: number, name: string} | null>(null);
  const [totalTracked, setTotalTracked] = useState(0);

  const processData = (logs: any[]) => {
    const lastReadMap: Record<number, string> = {};
    let maxSurahId = 0;

    logs.forEach((log) => {
      const current = new Date(log.created_at).getTime();
      const existing = lastReadMap[log.surah_number] ? new Date(lastReadMap[log.surah_number]).getTime() : 0;
      if (current > existing) lastReadMap[log.surah_number] = log.created_at;
      if (log.surah_number > maxSurahId) maxSurahId = log.surah_number;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const needsReview: RevisionItem[] = [];
    const trackedCount = Object.keys(lastReadMap).length;
    setTotalTracked(trackedCount);
    let weakCount = 0;

    Object.keys(lastReadMap).forEach((surahStr) => {
      const surahId = parseInt(surahStr);
      const lastReadDate = new Date(lastReadMap[surahId]);
      lastReadDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today.getTime() - lastReadDate.getTime()) / (1000 * 60 * 60 * 24)); 

      if (diffDays >= 2) {
        weakCount++;
        const surahInfo = SURAHS.find(s => s.id === surahId);
        needsReview.push({ 
          surah: surahId, 
          surahName: surahInfo?.name || `Surah ${surahId}`,
          daysAgo: diffDays, 
          lastRead: lastReadMap[surahId] 
        });
      }
    });

    if (maxSurahId < 114) {
      const next = SURAHS.find(s => s.id === maxSurahId + 1);
      if (next) setNextSuggested(next);
    }

    const score = trackedCount > 0 ? Math.round(((trackedCount - weakCount) / trackedCount) * 100) : 100;
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
    // 1. Try native mobile share first
    if (navigator.share) {
      await navigator.share({ title: 'My Hifz Progress', text: text });
    } 
    // 2. Fallback to clipboard (only works on HTTPS or localhost)
    else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      toast.success("Copied! Share it in your WhatsApp group.");
    } 
    // 3. Last resort fallback for non-secure HTTP connections
    else {
      throw new Error("Clipboard unavailable");
    }
  } catch (err) {
    console.error("Share failed:", err);
    toast.error("");
  }
};

  if (loading) return null;

  return (
    <Card className="border-white/5 bg-[#0a0a0a] overflow-hidden relative group p-6 rounded-[2.5rem]">
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all rotate-12">
        <BrainCircuit className="h-40 w-40 text-emerald-500" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-white font-black text-xl italic tracking-tight flex items-center gap-2">
              <Flame className={`h-5 w-5 ${retentionScore < 70 ? 'text-orange-500 animate-pulse' : 'text-emerald-500'}`} />
              Retention Health
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Live Memory Score</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="rounded-xl bg-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 h-10 w-10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            {/* 🚀 Navigation to Full Retention Page */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/dashboard/retention')}
              className="rounded-xl bg-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 h-10 w-10"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
             <span className="text-slate-500">Stability</span>
             <span className={retentionScore < 70 ? 'text-orange-500' : 'text-emerald-500'}>{retentionScore}%</span>
          </div>
          <Progress value={retentionScore} className="h-2 bg-white/5" />
        </div>

        {/* Action List */}
        {revisionList.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" /> Urgent Revision
            </p>
            {revisionList.map((item) => (
              <div key={item.surah} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black border ${item.daysAgo > 4 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                    {item.surah}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{item.surahName}</p>
                    <p className="text-[10px] text-slate-500 font-medium tracking-wide">Last log: {item.daysAgo}d ago</p>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => router.push('/dashboard/recite')}
                  className="rounded-full hover:bg-orange-500/20 text-slate-500 hover:text-orange-500"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 space-y-4">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Memory <span className="text-emerald-400 font-bold italic underline underline-offset-4">Optimized</span>. All tracked Surahs are currently in the safe zone.
              </p>
            </div>

            {nextSuggested && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group/goal cursor-pointer hover:bg-emerald-500/20 transition-all" onClick={() => router.push('/dashboard/recite')}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <Target className="h-3 w-3" /> Recommended
                    </p>
                    <h4 className="text-white font-bold text-sm tracking-tight">Begin Surah {nextSuggested.name}</h4>
                  </div>
                  <ArrowRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 🚀 Footer Link to Full Page */}
        <Button 
  variant="ghost" 
  onClick={() => router.push('/dashboard/retention')}
  className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500"
>
          Explore Detailed Memory Map
        </Button>
      </div>
    </Card>
  );
}