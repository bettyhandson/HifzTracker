'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Using the client-side supabase instance
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCards from "@/components/dashboard/StatCards";
import LogProgressForm from "@/components/dashboard/LogProgressForm";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import IslamicCalendar from "@/components/dashboard/IslamicCalendar";
import SmartRevision from "@/components/dashboard/SmartRevision";
import MotivationCard from '@/components/dashboard/MotivationCard';
import { Loader2, Quote } from "lucide-react";
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Check for Authenticated User first
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile({ ...dbProfile, isGuest: false });
      } else {
        // 2. Fallback to Guest Mode (Easy Access)
        const localData = localStorage.getItem('hifz_tracker_data');
        if (localData) {
          const guestData = JSON.parse(localData);
          setProfile({
            full_name: 'Guest Brother/Sister',
            current_streak: guestData.streak || 0,
            isGuest: true
          });
          setUserId('guest'); // Temporary ID for components
        } else {
          // If no guest data and no login, you could redirect to login here
          // but for "Easy Access" we'll let the StatCards handle the empty state
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
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
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
        <div className="space-y-6">
            {/* D. Motivation/Hadith Card (Small Block) */}
          <div className="col-span-1 md:col-span-5 lg:col-span-4 h-full">
            <Card className="bg-emerald-600 border-none p-6 h-full min-h-[240px] flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-emerald-900/20 rounded-[2rem]">
               {/* Decorative Icon */}
               <div className="absolute top-0 right-0 p-6 opacity-20">
                 <Quote className="h-24 w-24 text-white transform rotate-12" />
               </div>
               
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    <h3 className="text-lg font-bold text-white">Did you know?</h3>
                 </div>
                 <p className="text-white text-base font-medium leading-relaxed">
                   "The most beloved of deeds to Allah are those that are most consistent, even if they are small."
                 </p>
                 <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">(Bukhari)</p>
                 
                 <div className="h-px w-full bg-white/20 my-4" />
    
                 <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest flex items-center gap-2">
                    Current Streak: <span className="text-white bg-white/20 px-2 py-0.5 rounded-md">{profile?.current_streak || 0} Days</span>
                 </p>
               </div>
            </Card>
          </div>
               {/* 2. Main Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {/* If guest, we pass 'guest' so the form knows to save to localStorage instead of Supabase */}
            <LogProgressForm userId={userId} />
          </div>
        </div>
         <SmartRevision userId={userId} />

        {/* 1. Stat Cards Section */}
        <StatCards profile={profile} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <IslamicCalendar />
          </div>
          
          </div>
        </div>
        <div className="space-y-8">
          <ActivityHeatmap userId={userId} />
          {/* 🚀 The New Smart Revision Card */}
          
        </div>
      </div>
    </DashboardShell>
  );
}