'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Timer, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function FocusSettings({ userId }: { userId: string }) {
  const [duration, setDuration] = useState(30); // minutes
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const startIhsanMode = async () => {
    if (!goal) {
      toast.error("Please set a goal for this session");
      return;
    }

    setLoading(true);
    
    // Calculate end time based on selected minutes
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const { error } = await supabase
      .from('focus_sessions')
      .insert([{
        user_id: userId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        target_goal: goal,
        is_active: true
      }]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Ihsan Mode Activated! Focus on your Hifz.");
      // Redirect back to dashboard to trigger the shield
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <ShieldAlert className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Activate Hifz Mode</h3>
          <p className="text-xs text-slate-500">Lock distractions until your goal is met.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Duration (Minutes)</Label>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`py-3 rounded-xl text-xs font-bold transition-all ${
                  duration === mins ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Your Goal for this session</Label>
          <input 
            type="text"
            placeholder="e.g., Memorize 5 Ayahs of Surah Mulk"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white h-12 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <Button 
          onClick={startIhsanMode}
          disabled={loading}
          className="w-full bg-white text-black hover:bg-slate-200 h-14 rounded-2xl font-bold gap-2"
        >
          {loading ? "Activating..." : "Seal the Shield"}
        </Button>
      </div>
    </div>
  );
}