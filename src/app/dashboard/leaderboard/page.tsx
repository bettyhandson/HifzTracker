'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Flame, Loader2, Info, Star, Share2 } from "lucide-react"; // Added Share2

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsGuest(!session);

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, current_streak, total_xp, avatar_url')
        .order('total_xp', { ascending: false }) 
        .limit(10);

      if (error) {
        console.error("Leaderboard fetch error:", error.message);
      } else if (data) {
        setLeaders(data);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  // 🚀 Professional Share Logic
  const handleShare = async () => {
    const topThree = leaders.slice(0, 3).map((l, i) => 
      `${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} ${l.full_name}: ${l.total_xp || 0} XP`
    ).join('\n');

    const shareText = `🏆 *HifzTracker Leaderboard Update* 🏆\n\nCheck out the top Verse Masters of the week:\n\n${topThree}\n\nCan you beat their scores? Play now at:\nhttps://optimistcx.space/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HifzTracker Leaderboard',
          text: shareText,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Leaderboard rankings copied to clipboard! Paste it in the group.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-emerald-500" /> Community Leaderboard
            </h1>
            <p className="text-slate-400 text-sm">Top ranks in Quranic consistency and Knowledge XP.</p>
          </div>

          {/* 🚀 Share Button Added Here */}
          <div className="flex items-center gap-3">
            {!loading && leaders.length > 0 && (
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
              >
                <Share2 size={14} /> Share Rankings
              </button>
            )}
            
            {isGuest && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <Info className="h-4 w-4 text-emerald-500" />
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">
                  Sign in to join the rankings
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {leaders.length === 0 ? (
             <p className="text-center text-slate-500 py-10 italic">No rankings available yet.</p>
          ) : (
            leaders.map((leader, index) => (
              <Card 
                key={index} 
                className={`border-white/5 p-4 flex items-center justify-between transition-all rounded-[2rem] ${
                  index === 0 ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' : 'bg-[#0a0a0a]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-slate-500">
                    {index === 0 ? <Medal className="text-yellow-500 mx-auto" /> : index + 1}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 uppercase border border-emerald-500/10">
                    {leader.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{leader.full_name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                       <div className="flex items-center gap-1">
                        <Star size={10} className="text-emerald-500 fill-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                          {leader.total_xp || 0} XP
                        </span>
                       </div>
                       <div className="flex items-center gap-1">
                        <Flame size={10} className="text-orange-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {leader.current_streak || 0} Day Streak
                        </span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Verified Contributor</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}