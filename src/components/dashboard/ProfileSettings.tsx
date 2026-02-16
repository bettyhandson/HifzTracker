'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CloudSync } from "lucide-react";

export default function ProfileSettings({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  // Updated default to the Father/Son reciter ID
  const [reciter, setReciter] = useState(profile?.preferred_reciter || 'Minshawy_Teacher');
  const [goal, setGoal] = useState(profile?.daily_goal_ayahs || 10);
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={handleSave} className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Full Name</Label>
          <Input 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Preferred Reciter</Label>
          <select 
            value={reciter} 
            onChange={(e) => setReciter(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 text-white h-12 rounded-xl px-3 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {/* EveryAyah Compatible Reciters */}
            <optgroup label="Hifz & Teacher Styles">
              <option value="Minshawy_Teacher_128kbps">Minshawi (Father & Son Repeat)</option>
              <option value="Husary_Muallim_128kbps">Mahmoud Khalil Al-Husary (Muallim)</option>
            </optgroup>

            <optgroup label="Popular Global Reciters">
              <option value="ar.alafasy">Mishary Rashid Alafasy</option>
              <option value="ar.abdulsamad">AbdulBaset AbdulSamad</option>
              <option value="ar.abdullahbasfar">Abdullah Basfar</option>
              <option value="ar.abdurrahmaansudais">Abdurrahmaan As-Sudais</option>
              <option value="ar.mahermuaiqly">Maher Al-Muaiqly</option>
            </optgroup>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Daily Goal (Ayahs)</Label>
          <Input 
            type="number"
            value={goal} 
            onChange={(e) => setGoal(Number(e.target.value))}
            className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-emerald-500"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl transition-all gap-2"
      >
        {loading ? 'Processing...' : (
          <>
            {profile?.isGuest ? <CloudSync className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {profile?.isGuest ? 'Update Session' : 'Save Changes'}
          </>
        )}
      </Button>
    </form>
  );
}