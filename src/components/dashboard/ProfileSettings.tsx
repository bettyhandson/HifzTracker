'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CloudSync, Bell, UserCircle, Settings2, Target, Music } from "lucide-react";
import FocusSettings from './FocusSettings'; 

export default function ProfileSettings({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [reciter, setReciter] = useState(profile?.preferred_reciter || 'Minshawy_Teacher');
  const [goal, setGoal] = useState(profile?.daily_goal_ayahs || 10);
  const [loading, setLoading] = useState(false);

  const testNotification = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification("HifzTracker Reminder", {
          body: "This is what your daily Quran reminder looks like!",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: "test-notification"
        });
      } catch (err) {
        console.error("Test notification failed:", err);
      }
    } else {
      alert("Notifications are not supported on this browser.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (profile?.isGuest) {
      alert("Jazakumullahu Khayran! To save your preferred reciter and daily goals permanently across all devices, please create a free account.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        preferred_reciter: reciter,
        daily_goal_ayahs: goal
      })
      .eq('id', profile.id);

    if (error) {
      alert(error.message);
    } else {
      alert("Settings saved successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="p-2 sm:p-2 space-y-4 pb-4">  
      {/* --- Section 1: Ihsan Mode (Focus Settings) --- */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FocusSettings userId={profile?.id || 'guest'} />
      </div>

      {/* --- Section 2: Personal Identity --- */}
      <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <UserCircle className="h-4 w-4 text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Profile Configuration</span>
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70">Full Name</Label>
          <Input 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl focus:ring-emerald-500 text-base px-4"
          />
        </div>
      </div>

      {/* --- Section 3: Recitation Preferences --- */}
      <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Music className="h-4 w-4 text-purple-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Audio Preferences</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70">Preferred Reciter</Label>
            <div className="relative">
              <select 
                value={reciter} 
                onChange={(e) => setReciter(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 text-white h-14 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none text-base transition-all"
              >
                <optgroup label="Hifz & Teacher Styles" className="bg-[#0a0a0a]">
                  <option value="Minshawy_Teacher_128kbps">Minshawi (Father & Son Repeat)</option>
                  <option value="Husary_Muallim_128kbps">Mahmoud Khalil Al-Husary (Muallim)</option>
                </optgroup>
                <optgroup label="Multi-language Styles" className="bg-[#0a0a0a]">
                  <option value="ar.english.basfar">Basfar + English (Translation)</option>
                </optgroup>
                <optgroup label="Popular Global Reciters" className="bg-[#0a0a0a]">
                  <option value="ar.alafasy">Mishary Rashid Alafasy</option>
                  <option value="ar.abdulsamad">AbdulBaset AbdulSamad</option>
                  <option value="ar.abdullahbasfar">Abdullah Basfar</option>
                  <option value="ar.abdurrahmaansudais">Abdurrahmaan As-Sudais</option>
                  <option value="ar.mahermuaiqly">Maher Al-Muaiqly</option>
                </optgroup>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70">Daily Goal (Ayahs)</Label>
            <div className="relative flex items-center">
              <Input 
                type="number"
                inputMode="numeric"
                value={goal} 
                onChange={(e) => setGoal(Number(e.target.value))}
                className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl focus:ring-emerald-500 text-base pr-12"
              />
              <Target className="absolute right-4 h-5 w-5 text-emerald-500/50" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 4: Actions --- */}
      <div className="space-y-3">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 rounded-2xl transition-all gap-2 text-base active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          {loading ? 'Processing...' : (
            <>
              {profile?.isGuest ? <CloudSync className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              {profile?.isGuest ? 'Update Session' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>

      {/* --- Footer --- */}
      <footer className="text-center pt-4 opacity-30">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
          "The best among you are those who learn the Quran and teach it."
        </p>
      </footer>
    </div>
  );
}