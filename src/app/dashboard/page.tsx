'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCards from "@/components/dashboard/StatCards";
import LogProgressForm from "@/components/dashboard/LogProgressForm";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import IslamicCalendar from "@/components/dashboard/IslamicCalendar";
import SmartRevision from "@/components/dashboard/SmartRevision";
import FocusShield from "@/components/dashboard/FocusShield"; // 🚀 Import the Shield
import { Loader2, Quote, BellRing, ShieldCheck } from "lucide-react"; 
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 

import hadiths from '@/data/hadiths.json'; 

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<any>(null); // 🚀 Track Ihsan Mode

  const [dailyHadith, setDailyHadith] = useState({ 
    text: 'Loading spiritual wisdom...', 
    source: 'Hadith' 
  });

  useEffect(() => {
    async function loadDashboardData() {
      // --- Hadith Rotation Logic ---
      if (hadiths && hadiths.length > 0) {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const hadithIndex = dayOfYear % hadiths.length;
        setDailyHadith(hadiths[hadithIndex]);
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile({ ...dbProfile, isGuest: false });

        // 🚀 Check for Active Ihsan Mode Session
        const { data: session } = await supabase
          .from('focus_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gt('end_time', new Date().toISOString())
          .single();
        
        if (session) setActiveSession(session);

      } else {
        const localData = localStorage.getItem('hifz_tracker_data');
        if (localData) {
          const guestData = JSON.parse(localData);
          setProfile({
            full_name: 'Guest Brother/Sister',
            current_streak: guestData.streak || 0,
            isGuest: true
          });
          setUserId('guest');
        } else {
          setProfile({ full_name: 'Brother/Sister', current_streak: 0, isGuest: true });
        }
      }
      setLoading(false);
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <DashboardShell>
      {/* 🚀 The Blocker UI: Shows if a session is active */}
   <FocusShield 
  isActive={!!activeSession} 
  targetGoal={activeSession?.target_goal || "your daily portion"} 
  endTime={activeSession?.end_time} // 🚀 Pass the timestamp here
/>
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white">
            As-salamu alaykum, <span className="text-emerald-500">{profile?.full_name || 'Brother/Sister'}</span>
          </h1>
          {profile?.isGuest && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl w-fit">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                Guest Mode • Data saved locally
              </p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-emerald-600 border-none p-6 relative overflow-hidden shadow-2xl rounded-[2rem]">
             <div className="absolute top-0 right-0 p-6 opacity-20">
               <Quote className="h-20 w-20 text-white transform rotate-12" />
             </div>
             <div className="relative z-10 space-y-4">
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Hadith of the Day</h3>
               </div>
               <p className="text-white text-base font-medium leading-relaxed italic">
                 "{dailyHadith.text}"
               </p>
               <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">
                 ({dailyHadith.source})
               </p>
             </div>
          </Card>

          {/* 🚀 Logic to prompt Ihsan Mode or Reminders */}
            <Card className="bg-gradient-to-br from-slate-900 to-black border border-emerald-500/20 p-6 relative overflow-hidden rounded-[2rem] flex flex-col justify-between">
              <div className="relative z-10 space-y-3">
                <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Hifz Mode</h3>
                  <p className="text-gray-400 text-sm">Lock distractions and focus purely on your Hifz goals.</p>
                </div>
                <Button 
                 onClick={() => window.location.href = '/dashboard/settings'}
                 className="w-fit bg-white text-black hover:bg-gray-200 rounded-full px-6 font-bold"
                >
                  Configure Shield
                </Button>
              </div>
            </Card>
        </div>

        {/* Rest of the dashboard components remain the same */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <LogProgressForm userId={userId} />
          </div>
        </div>
        
        <SmartRevision userId={userId} />
        <StatCards profile={profile} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <IslamicCalendar />
          </div>
        </div>

        <div className="space-y-8">
          <ActivityHeatmap userId={userId} />
        </div>
      </div>
    </DashboardShell>
  );
}