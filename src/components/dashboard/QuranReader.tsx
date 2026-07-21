'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Repeat1, Gauge, ChevronDown, BookOpen, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useReadingTracker } from '@/hooks/useReadingTracker';

export default function QuranReader({ userId }: { userId: string }) {
  const router = useRouter();
  const { isPlaying, playAyah, activeAyahIndex, playbackRate, setRate, repeatCount, setRepeatCount, toggleAudio } = useAudio();
  // Update this line in QuranReader.tsx
  const { getSessionTime, resetTimer, isSubmitting } = useReadingTracker();
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferredReciter, setPreferredReciter] = useState('Minshawy_Teacher');
  
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

const logProgress = async () => {
  if (!userId || userId === 'guest' || ayahs.length === 0) return;

  const totalAyahs = ayahs.length;
  const timeSpent = getSessionTime(); 
  const MIN_SECONDS = totalAyahs * 5; 
  const potentialPoints = totalAyahs * 2;
  const DAILY_CAP = 72;

  // 1. ANTI-CHEAT: BLOCK IF TIME IS TOO SHORT
  if (timeSpent < MIN_SECONDS) {
    toast.error(`Please spend at least ${MIN_SECONDS} seconds reading.`);
    return;
  }

  try {
    // 2. Fetch today's points to enforce the 72-point cap
    const today = new Date().toISOString().split('T')[0];
    const { data: todayLogs } = await supabase
      .from('progress_logs')
      .select('points_earned')
      .eq('user_id', userId)
      .gte('created_at', today);

    const pointsAlreadyEarned = todayLogs?.reduce((sum, log) => sum + (log.points_earned || 0), 0) || 0;

    // 3. ENFORCE CAP
    if (pointsAlreadyEarned >= DAILY_CAP) {
      toast.info("Daily point cap reached come back tommorow to earn more points.");
      return;
    }

    // 4. Calculate points (Cap at remainder if necessary)
    const pointsToAward = Math.min(potentialPoints, DAILY_CAP - pointsAlreadyEarned);

    // 5. Insert into progress_logs
    const logData = {
      user_id: userId,
      surah_number: selectedSurah,
      surah_name: surahs.find(s => s.number === selectedSurah)?.englishName,
      ayah_start: 1,
      ayah_end: totalAyahs,
    
      points_earned: pointsToAward,
      seconds_spent: timeSpent
    };

    const { error } = await supabase.from('progress_logs').insert([logData]);
    if (error) throw error;

    // 6. Increment profile balance
    await supabase.rpc('increment_points', { p_user_id: userId, p_points: pointsToAward });

    toast.success(`Progress logged! Earned ${pointsToAward} points.`);
    resetTimer(); 
  } catch (err: any) {
    console.error("Supabase Error:", err);
    toast.error(`Error: ${err.message}`);
  }
};
  // ... [Keep your existing useEffects for fetchProfile, fetch Surahs, fetch Ayahs, and scroll] ...
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || userId === 'guest') return;
      const { data } = await supabase.from('profiles').select('preferred_reciter').eq('id', userId).single();
      if (data?.preferred_reciter) setPreferredReciter(data.preferred_reciter);
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah').then(res => res.json()).then(data => setSurahs(data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    resetTimer(); 
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/quran-uthmani,en.sahih`)
      .then(res => res.json())
      .then(data => {
        const combined = data.data[0].ayahs.map((v: any, i: number) => ({
          ...v, 
          translation: data.data[1].ayahs[i].text,
          surahNumber: selectedSurah,
          numberInSurah: v.numberInSurah
        }));
        setAyahs(combined);
        setLoading(false);
      });
  }, [selectedSurah, resetTimer]);

  useEffect(() => {
    if (activeAyahIndex !== null) {
      ayahRefs.current[activeAyahIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (activeAyahIndex === ayahs.length - 1 && !isPlaying) {
         logProgress();
      }
    }
  }, [activeAyahIndex, isPlaying]);

  return (
    // ... [Your existing return JSX is perfectly fine] ...
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col z-0">
      <div className="flex-none p-4 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="text-emerald-500 bg-emerald-500/10 rounded-xl h-10 w-10 border border-emerald-500/20">
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logProgress} 
            disabled={isSubmitting} 
            className="text-amber-500 bg-amber-500/10 rounded-xl h-10 w-10 border border-amber-500/20 disabled:opacity-50"
          >
            <ClipboardList className="h-5 w-5" />
          </Button>
          <div className="relative">
             <select 
              value={selectedSurah} 
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
              className="bg-white/5 text-white font-bold rounded-full pl-4 pr-8 py-2 text-[10px] sm:text-xs outline-none appearance-none border border-white/10"
            >
              {surahs.map(s => <option key={s.number} value={s.number} className="bg-[#0a0a0a]">{s.number}. {s.englishName}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
          </div>
        </div>
        {/* ... audio controls ... */}
        <div className="flex items-center gap-1">
          <Button onClick={() => isPlaying ? toggleAudio() : playAyah(activeAyahIndex ?? 0, ayahs, preferredReciter)} variant="ghost" size="icon" className="text-emerald-500 bg-emerald-500/10 rounded-full h-10 w-10 mr-1">
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-slate-400 h-10 w-10"><Gauge className="h-5 w-5" /></Button>
            <select value={playbackRate} onChange={(e) => setRate(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer">
              {[0.5, 1, 1.5, 2].map(r => <option key={r} value={r} className="bg-black">{r}x</option>)}
            </select>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" className={`${repeatCount > 0 ? 'text-emerald-500' : 'text-slate-400'} h-10 w-10`}>
              <Repeat1 className="h-5 w-5" />
            </Button>
            <select value={repeatCount} onChange={(e) => setRepeatCount(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer">
              {[0, 1, 2, 3, 5].map(c => <option key={c} value={c} className="bg-black">{c === 0 ? 'Off' : `${c}x`}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto touch-auto px-4 py-6 scroll-smooth" style={{ overscrollBehaviorY: 'contain' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div></div>
        ) : (
          <div className="space-y-6 pb-64 max-w-2xl mx-auto">
            {ayahs.map((ayah, index) => (
              <div key={ayah.number} ref={el => { ayahRefs.current[index] = el; }} onClick={() => playAyah(index, ayahs, preferredReciter)} className={`p-6 rounded-[1.8rem] transition-all cursor-pointer ${activeAyahIndex === index ? 'bg-emerald-500/15 ring-2 ring-emerald-500/30' : 'bg-white/[0.03]'}`}>
                <p className="text-3xl text-right font-arabic leading-relaxed" dir="rtl">{ayah.text}</p>
                <p className="text-sm text-slate-400 leading-relaxed italic">{ayah.translation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}