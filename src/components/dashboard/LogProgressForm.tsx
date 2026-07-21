'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { findSurah, SURAHS } from '@/lib/quran'; 
import { toast } from "sonner";
import { useReadingTracker } from '@/hooks/useReadingTracker';


export default function LogProgressForm({ userId }: { userId: string | null }) {
  const { getSessionTime, resetTimer } = useReadingTracker(); // Add getSessionTime and resetTimer
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [surahInput, setSurahInput] = useState(''); 
  const [startAyah, setStartAyah] = useState('');
  const [endAyah, setEndAyah] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

 

  const filteredSurahs = useMemo(() => {
    if (surahInput.length < 2) return [];
    return SURAHS.filter(s => 
      s.name.toLowerCase().includes(surahInput.toLowerCase()) || 
      s.id.toString().includes(surahInput)
    ).slice(0, 5); // Limit to 5 suggestions
  }, [surahInput]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  // Get the time immediately when user clicks "Save"
  const timeSpent = getSessionTime(); 
  const totalAyahs = (parseInt(endAyah) - parseInt(startAyah) + 1);
  const MIN_SECONDS = totalAyahs * 5;

    const surahData = findSurah(surahInput);
    if (!surahData) {
      toast.error("Please enter a valid Surah name or number.");
      setLoading(false);
      return;
    }

    const start = parseInt(startAyah);
    const end = parseInt(endAyah);
    // Fixed: Defined once here
    
    
     
    const potentialPoints = totalAyahs * 2;
    const DAILY_CAP = 72;

    // ANTI-CHEAT: Check time before doing anything else
   if (userId !== 'guest' && timeSpent < MIN_SECONDS) {
    // Log for debugging: See what the hook thinks the time is
    console.log("Current timeSpent:", timeSpent, "Required:", MIN_SECONDS);
    toast.error(`Please spend at least ${MIN_SECONDS} seconds reading. (Current: ${timeSpent}s)`);
    setLoading(false);
    return;
  }

    try {
      if (userId === 'guest') {
        const logEntry = {
          surah_number: surahData.id,
          surah_name: surahData.name,
          ayah_start: start,
          ayah_end: end,
          total_ayahs_read: totalAyahs,
          created_at: new Date().toISOString(),
        };
        const existingLogs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
        localStorage.setItem('hifz_progress_logs', JSON.stringify([logEntry, ...existingLogs]));
        toast.success(`Progress logged for ${surahData.name}!`);
        setSurahInput(''); setStartAyah(''); setEndAyah('');
        window.location.reload(); 
      } else {
       const today = new Date().toISOString().split('T')[0];
const { data: todayLogs } = await supabase
  .from('progress_logs')
  .select('points_earned')
  .eq('user_id', userId)
  .gte('created_at', today);

const pointsAlreadyEarned = todayLogs?.reduce((sum, log) => sum + (log.points_earned || 0), 0) || 0;

        // 2. STRIKE-THROUGH LOGIC: Prevent awarding anything if cap reached
if (pointsAlreadyEarned >= DAILY_CAP) {
  toast.info("Daily point cap reached (72 points).");
  setLoading(false);
  return;
}

        // 3. STRICT CALCULATION: Points to award cannot exceed (DAILY_CAP - pointsAlreadyEarned)
const pointsToAward = Math.min(potentialPoints, DAILY_CAP - pointsAlreadyEarned);

        const { error } = await supabase.from('progress_logs').insert([{ 
          user_id: userId,
          surah_number: surahData.id,
          surah_name: surahData.name,
          ayah_start: start,
          ayah_end: end,
          total_ayahs_read: totalAyahs,
          points_earned: pointsToAward,
          seconds_spent: timeSpent // Fixed: Saving the actual time
        }]);

        if (error) throw error;

        await supabase.rpc('increment_points', { p_user_id: userId, p_points: pointsToAward });
        
        toast.success(`Alhamdulillah! You earned ${pointsToAward} points.`);
        setSurahInput(''); setStartAyah(''); setEndAyah('');
        router.refresh();
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <Card className="border-white/5 bg-[#0a0a0a] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-white flex items-center gap-3 text-lg font-bold">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
             <BookOpen className="h-5 w-5" />
          </div>
          <span className="tracking-tight">Log Daily Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1 space-y-2 relative">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surah Name or No.</Label>
              <Input 
                type="text" 
                placeholder="e.g. 2 or Baqarah" 
                value={surahInput} 
                onChange={(e) => { setSurahInput(e.target.value); setShowSuggestions(true); }} 
                onFocus={() => setShowSuggestions(true)}
                required 
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium"
              />
              {showSuggestions && filteredSurahs.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                   {filteredSurahs.map((s) => (
                     <button
                        key={s.id} type="button"
                        className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors flex justify-between items-center"
                        onClick={() => { setSurahInput(s.name); setShowSuggestions(false); }}
                     >
                       <span className="font-bold">{s.name}</span>
                       <span className="text-[10px] text-slate-500">#{s.id}</span>
                     </button>
                   ))}
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Ayah</Label>
              <Input type="number" placeholder="From" value={startAyah} onChange={(e) => setStartAyah(e.target.value)} required className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium" />
            </div>
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Ayah</Label>
              <Input type="number" placeholder="To" value={endAyah} onChange={(e) => setEndAyah(e.target.value)} required className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl text-sm" disabled={loading}>
            {loading ? 'Logging Deeds...' : <><CheckCircle2 className="h-5 w-5" /> Save Reading Session</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}