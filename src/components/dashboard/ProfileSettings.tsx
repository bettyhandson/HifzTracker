'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CloudSync, Bell } from "lucide-react";
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
    // 🚀 Added max-w-xl and mx-auto to prevent the form from stretching too wide on tablets
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 space-y-10 pb-20">
      
      {/* --- Section 1: Profile Configuration --- */}
      <section className="space-y-6">
        <header>
          <h2 className="text-xl font-bold text-white mb-1">Account Settings</h2>
          <p className="text-sm text-slate-500">Manage your recitation preferences and goals.</p>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-5">
            
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Full Name</Label>
              <Input 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:ring-emerald-500 text-base" // 🚀 text-base prevents iOS zoom-in on focus
              />
            </div>

            {/* Preferred Reciter Field */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Preferred Reciter</Label>
              <div className="relative">
                <select 
                  value={reciter} 
                  onChange={(e) => setReciter(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white h-14 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none text-base transition-all"
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
                {/* 🚀 Custom Chevron for better UI */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                   <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            {/* Daily Goal Field */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Daily Goal (Ayahs)</Label>
              <Input 
                type="number"
                inputMode="numeric" // 🚀 Triggers numeric keypad on mobile
                value={goal} 
                onChange={(e) => setGoal(Number(e.target.value))}
                className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:ring-emerald-500 text-base"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 grid grid-cols-1 gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 rounded-2xl transition-all gap-2 text-base active:scale-95"
            >
              {loading ? 'Processing...' : (
                <>
                  {profile?.isGuest ? <CloudSync className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  {profile?.isGuest ? 'Update Session' : 'Save Changes'}
                </>
              )}
            </Button>

            <Button 
              type="button" 
              onClick={testNotification} 
              variant="outline" 
              className="w-full border-white/10 text-slate-300 hover:bg-white/5 rounded-2xl h-14 font-semibold gap-2 text-sm active:scale-95"
            >
              <Bell className="h-4 w-4" />
              Test Notification
            </Button>
          </div>
        </form>
      </section>

      {/* --- Section 2: Ihsan Mode Configuration --- */}
      <section className="pt-8 border-t border-white/5">
        <FocusSettings userId={profile?.id || 'guest'} />
      </section>
    </div>
  );
}