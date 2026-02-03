'use client';

import { useEffect, useState, useRef } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Flame, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from 'html-to-image';
import AchievementPopup from './AchievementPopup'; // Import the new popup

export default function ActivityHeatmap({ userId }: { userId: string }) {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const heatmapRef = useRef<HTMLDivElement>(null);

  // Helper function to calculate consecutive days of activity
  const calculateStreak = (activityData: { date: string; count: number }[]) => {
    if (activityData.length === 0) return 0;
    
    // Sort dates descending (newest first)
    const sortedDates = activityData
      .map(d => new Date(d.date).getTime())
      .sort((a, b) => b - a);

    let streak = 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start checking from the most recent activity
    let lastDate = new Date(sortedDates[0]);
    lastDate.setHours(0, 0, 0, 0);

    // If latest activity is older than yesterday, streak is 0
    if (today.getTime() - lastDate.getTime() > oneDay) return 0;

    streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      
      const diff = lastDate.getTime() - currentDate.getTime();

      if (diff === oneDay) {
        streak++;
        lastDate = currentDate;
      } else if (diff > oneDay) {
        break; // Gap found
      }
    }
    return streak;
  };

  const exportImage = async () => {
    if (heatmapRef.current === null) return;
    try {
      const dataUrl = await toPng(heatmapRef.current, { 
        cacheBust: true,
        backgroundColor: '#020617', 
      });
      const link = document.createElement('a');
      link.download = `hifz-momentum-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: hifzLogs } = await supabase
        .from('progress_logs')
        .select('created_at')
        .eq('user_id', userId);

      const { data: masjidLogs } = await supabase
        .from('masjid_logs')
        .select('created_at')
        .eq('user_id', userId);

      const counts: Record<string, number> = {};

      hifzLogs?.forEach((log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        counts[date] = (counts[date] || 0) + 2; 
      });

      masjidLogs?.forEach((log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        counts[date] = (counts[date] || 0) + 1; 
      });

      const formattedData = Object.keys(counts).map(date => ({ date, count: counts[date] }));
      setData(formattedData);

      // Check for streak milestone
      const streak = calculateStreak(formattedData);
      setCurrentStreak(streak);
      if (streak === 7) {
        setShowAchievement(true);
      }
    };
    fetchActivity();
  }, [userId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-emerald-500 flex items-center gap-2 font-bold tracking-tight">
          <Flame className="h-5 w-5" /> Spiritual Momentum
        </h3>
        <Button 
          onClick={exportImage}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 h-9 shadow-lg shadow-emerald-900/20 gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs font-bold">Share My Journey</span>
        </Button>
      </div>

      <Card 
        ref={heatmapRef} 
        className="border-white/5 bg-slate-950 relative overflow-hidden p-8 rounded-3xl"
      >
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-900/20 rounded-full blur-[100px]" />

        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                HifzTracker<span className="text-emerald-500">.</span>
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Your Journey To Eternity</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
               <Sparkles className="h-3 w-3 text-emerald-400" />
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Ramadan 1447H</span>
            </div>
          </div>

          <div className="custom-heatmap py-4">
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={data}
              classForValue={(value) => {
                if (!value || value.count === 0) return 'color-empty';
                const intensity = Math.min(Math.ceil(value.count / 2), 4);
                return `color-emerald-${intensity}`;
              }}
            />
          </div>

          <div className="flex justify-between items-end pt-4 border-t border-white/5">
            <div>
              <p className="text-xs font-bold text-white mb-1">Consistency is Key</p>
              <div className="flex gap-1 items-center">
                <span className="text-[10px] text-slate-500 mr-2 uppercase tracking-tighter font-bold">Intensity</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-white/5' : `color-emerald-${i}`}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-tighter font-bold">Join the Mission</p>
               <p className="text-sm font-black text-emerald-500 tracking-tighter uppercase">hifztracker.com</p>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .custom-heatmap .color-empty { fill: rgba(255, 255, 255, 0.05); }
          .color-emerald-1 { fill: #064e3b; }
          .color-emerald-2 { fill: #047857; }
          .color-emerald-3 { fill: #10b981; }
          .color-emerald-4 { fill: #34d399; }
          .react-calendar-heatmap text { font-size: 8px; fill: #475569; font-weight: 600; }
        `}</style>
      </Card>

      {/* Achievement Popup Integration */}
      <AchievementPopup 
        isOpen={showAchievement} 
        onClose={() => setShowAchievement(false)} 
        streak={currentStreak} 
      />
    </div>
  );
}