'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Using the client-side supabase instance
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCards from "@/components/dashboard/StatCards";
import LogProgressForm from "@/components/dashboard/LogProgressForm";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import IslamicCalendar from "@/components/dashboard/IslamicCalendar";
import { Loader2 } from "lucide-react";

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
          <p className="text-slate-500">
            Track your journey. Your consistency today is your reward for eternity.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <IslamicCalendar />
          </div>
          <div className="space-y-6">
            {/* 3. Quick Tips/Hadith Card */}
            <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold mb-4">Did you know?</h3>
                <p className="text-emerald-50 text-sm italic leading-relaxed">
                  "The most beloved of deeds to Allah are those that are most consistent, even if they are small." 
                  (Bukhari)
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/30">
                <p className="text-xs text-emerald-100">
                  You are currently on a <span className="font-bold">{profile?.current_streak || 0} day</span> streak. 
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Stat Cards Section */}
        <StatCards profile={profile} />

        {/* 2. Main Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* If guest, we pass 'guest' so the form knows to save to localStorage instead of Supabase */}
            <LogProgressForm userId={userId} />
          </div>
        </div>

        <div className="space-y-8">
          <ActivityHeatmap userId={userId} />
        </div>
      </div>
    </DashboardShell>
  );
}