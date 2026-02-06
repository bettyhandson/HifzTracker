'use client';

import { useEffect, useState, useRef } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Flame, Share2, Sparkles, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toBlob } from 'html-to-image';
import AchievementPopup from './AchievementPopup';

export default function ActivityHeatmap({ userId }: { userId: string | null }) {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState({ streak: 0, total: 0, activeDays: 0 });
  const [showAchievement, setShowAchievement] = useState(false);
  const [sharing, setSharing] = useState(false);
  const heatmapRef = useRef<HTMLDivElement>(null);

  const calculateStats = (activityData: { date: string; count: number }[]) => {
    const total = activityData.reduce((acc, curr) => acc + curr.count, 0);
    const activeDays = activityData.filter(d => d.count > 0).length;

    const sortedDates = activityData
      .map(d => new Date(d.date).getTime())
      .sort((a, b) => b - a);

    let streak = 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (sortedDates.length > 0) {
      let lastDate = new Date(sortedDates[0]);
      lastDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() - lastDate.getTime() <= oneDay) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          currentDate.setHours(0, 0, 0, 0);
          if (lastDate.getTime() - currentDate.getTime() === oneDay) {
            streak++;
            lastDate = currentDate;
          } else {
            break;
          }
        }
      }
    }
    return { streak, total, activeDays };
  };

  const handleShare = async () => {
    if (heatmapRef.current === null) return;
    setSharing(true);

    try {
      // 1. Generate High-Res Blob
      const blob = await toBlob(heatmapRef.current, { 
        cacheBust: true,
        backgroundColor: '#020617', 
        pixelRatio: 2 
      });

      if (!blob) throw new Error("Image generation failed");

      // 2. Create File Object
      const file = new File([blob], 'hifz-momentum.png', { type: 'image/png' });
      
      const shareData = {
        title: 'My HifzTracker Momentum',
        text: `I've maintained a ${stats.streak}-day streak on HifzTracker! 🚀\n\nJoin me on HifzTracker:`,
        url: 'https://optimistcx.space', 
        files: [file]
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const link = document.createElement('a');
        link.download = `hifz-momentum-${new Date().toISOString().split('T')[0]}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        await navigator.clipboard.writeText('https://optimistcx.space');
        alert("Image downloaded & Link copied to clipboard! 📋");
      }
    } catch (err) {
      console.error('Sharing failed', err);
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const counts: Record<string, number> = {};

      if (userId === 'guest') {
        const localLogs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
        localLogs.forEach((log: any) => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          counts[date] = (counts[date] || 0) + 2; 
        });
      } else if (userId) {
        const { data: hifzLogs } = await supabase
          .from('progress_logs')
          .select('created_at')
          .eq('user_id', userId);

        hifzLogs?.forEach((log) => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          counts[date] = (counts[date] || 0) + 2; 
        });
      }

      const formattedData = Object.keys(counts).map(date => ({ date, count: counts[date] }));
      setData(formattedData);
      
      const newStats = calculateStats(formattedData);
      setStats(newStats);
      
      if (newStats.streak === 7) setShowAchievement(true);
    };
    
    fetchActivity();
  }, [userId]);

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-full">
      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-white flex items-center gap-2 font-bold tracking-tight text-lg">
            <Flame className="h-5 w-5 text-emerald-500" /> Spiritual Momentum
          </h3>
        </div>
        <Button 
          onClick={handleShare}
          disabled={sharing}
          className="bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 rounded-xl px-4 h-9 md:h-10 gap-2 transition-all"
        >
          {sharing ? <Sparkles className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
            {sharing ? 'Generating...' : 'Share Journey'}
          </span>
        </Button>
      </div>

      <Card 
        ref={heatmapRef} 
        className="border-white/5 bg-[#020617] relative overflow-hidden p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl w-full"
      >
        <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-emerald-500/5 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-emerald-900/10 rounded-full blur-[50px] md:blur-[80px]" />

        <div className="relative z-10 space-y-6 md:space-y-8">
          {/* Header: Stacked on Mobile, Row on Desktop */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center gap-1">
                HifzTracker<span className="text-emerald-500 text-3xl md:text-4xl">.</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 md:w-8 bg-emerald-500/50 rounded-full"></span>
                <p className="text-[9px] md:text-[10px] text-emerald-500/80 uppercase tracking-[0.2em] font-bold">hifztracker</p>
              </div>
            </div>
            
            <div className="flex gap-4 self-end md:self-auto">
               <div className="text-right">
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                    Focus Sessions <Zap className="h-3 w-3 text-emerald-500" />
                  </p>
                  <p className="text-lg md:text-xl font-black text-white">{stats.total}</p>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="text-right">
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Days</p>
                  <p className="text-lg md:text-xl font-black text-emerald-400">{stats.activeDays}</p>
               </div>
            </div>
          </div>

          {/* Heatmap Container: Constrained to Width */}
          <div className="custom-heatmap py-2 w-full overflow-hidden">
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={data}
              classForValue={(value) => {
                if (!value || value.count === 0) return 'color-empty';
                const intensity = Math.min(Math.ceil(value.count / 2), 4);
                return `color-emerald-${intensity}`;
              }}
              gutterSize={2} // Reduced gutter slightly for mobile density
              showWeekdayLabels={true}
            />
          </div>

          {/* Footer: Stacked on Mobile */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-4 md:pt-6 border-t border-white/5 gap-4 md:gap-0">
            <div className="flex items-center gap-4">
               <div className="bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10 flex items-center gap-2">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  <span className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                     Current Streak: {stats.streak} Days
                  </span>
               </div>
            </div>
            
            <div className="flex items-center gap-2 self-end md:self-auto">
               <span className="text-[8px] md:text-[9px] text-slate-600 font-bold uppercase tracking-widest">Less</span>
               <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white/5' : `color-emerald-${i}`}`} />
                  ))}
               </div>
               <span className="text-[8px] md:text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-1">More</span>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .react-calendar-heatmap text { font-size: 9px; fill: #475569; font-weight: 700; font-family: inherit; }
          
          /* 🚀 Fix: Reverted white fill to low-opacity white for better dark mode aesthetics */
          .custom-heatmap .color-empty { fill: rgba(255, 255, 255, 0.03); rx: 2px; }
          
          .color-emerald-1 { fill: #064e3b; rx: 3px; }
          .color-emerald-2 { fill: #059669; rx: 3px; }
          .color-emerald-3 { fill: #10b981; rx: 4px; filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.3)); }
          .color-emerald-4 { fill: #34d399; rx: 4px; filter: drop-shadow(0 0 4px rgba(52, 211, 153, 0.5)); }
          
          rect { transition: all 0.3s ease; }
          rect:hover { stroke: #fff; stroke-width: 1px; }

          /* Mobile Tweaks */
          @media (max-width: 640px) {
            .react-calendar-heatmap text { font-size: 7px; }
          }
        `}</style>
      </Card>

      <AchievementPopup isOpen={showAchievement} onClose={() => setShowAchievement(false)} streak={stats.streak} />
    </div>
  );
}