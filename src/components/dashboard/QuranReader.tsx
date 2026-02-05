'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Repeat1, Gauge, ChevronDown, BookOpen, ClipboardList } from 'lucide-react'; // 🚀 Added ClipboardList
import { Button } from '@/components/ui/button';
import { toast } from "sonner"; // For feedback

export default function QuranReader({ userId }: { userId: string }) {
  const router = useRouter();
  const { isPlaying, playAyah, activeAyahIndex, playbackRate, setRate, repeatCount, setRepeatCount, toggleAudio } = useAudio();
  
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferredReciter, setPreferredReciter] = useState('ar.alafasy');
  
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 🚀 Logic to Log Progress
const logProgress = async () => {
  const surahName = surahs.find(s => s.number === selectedSurah)?.englishName || `Surah ${selectedSurah}`;
  
  // 🟢 Match your table columns EXACTLY
  const logData = {
    // Only include user_id if you added it to the DB in the step above!
    user_id: userId, 
    surah_number: selectedSurah,
    ayah_start: 1,
    ayah_end: ayahs.length,
  };

  if (userId && userId !== 'guest') {
    const { error } = await supabase
      .from('progress_logs')
      .insert([logData]);
    
    if (error) {
      // Use error.message to see the actual text error
      console.error("Supabase Error:", error.message);
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success(`Progress logged: ${surahName}`);
    }
  } else {
    // Guest logic...
    const localLogs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
    localLogs.push({ ...logData, created_at: new Date().toISOString() });
    localStorage.setItem('hifz_progress_logs', JSON.stringify(localLogs));
    toast.success(`${surahName} saved locally!`);
  }
};

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
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/quran-uthmani,en.sahih`)
      .then(res => res.json())
      .then(data => {
        const combined = data.data[0].ayahs.map((v: any, i: number) => ({
          ...v, translation: data.data[1].ayahs[i].text
        }));
        setAyahs(combined);
        setLoading(false);
      });
  }, [selectedSurah]);

  // 🚀 Enhanced Auto-Scroll & Auto-Log
  useEffect(() => {
    if (activeAyahIndex !== null) {
      ayahRefs.current[activeAyahIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Auto-log when the last Ayah of the Surah finishes
      if (activeAyahIndex === ayahs.length - 1 && !isPlaying) {
         // This triggers when the 'onended' in AudioContext finishes the last item
         logProgress();
      }
    }
  }, [activeAyahIndex, isPlaying]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col z-0">
      
      {/* 🟢 THE HEADER */}
      <div className="flex-none p-4 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl z-50 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          {/* Dashboard Icon */}
          <Button 
            variant="ghost" size="icon" 
            onClick={() => router.push('/dashboard')}
            className="text-emerald-500 bg-emerald-500/10 rounded-xl h-10 w-10 border border-emerald-500/20"
          >
            <BookOpen className="h-5 w-5" />
          </Button>

          {/* 🚀 New Log Progress Icon */}
          <Button 
            variant="ghost" size="icon" 
            onClick={logProgress}
            className="text-amber-500 bg-amber-500/10 rounded-xl h-10 w-10 border border-amber-500/20"
          >
            <ClipboardList className="h-5 w-5" />
          </Button>

          {/* Surah Selector */}
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

        <div className="flex items-center gap-1">
          <Button 
            onClick={() => isPlaying ? toggleAudio() : playAyah(activeAyahIndex ?? 0, ayahs, preferredReciter)}
            variant="ghost" size="icon" className="text-emerald-500 bg-emerald-500/10 rounded-full h-10 w-10 mr-1"
          >
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

      {/* --- Native Scroll Feed --- */}
      <div className="flex-1 overflow-y-auto touch-auto px-4 py-6 scroll-smooth">
        {loading ? (
          <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div></div>
        ) : (
          <div className="space-y-6 pb-64 max-w-2xl mx-auto">
            {ayahs.map((ayah, index) => (
              <div 
                key={ayah.number}
                ref={el => { ayahRefs.current[index] = el; }}
                onClick={() => playAyah(index, ayahs, preferredReciter)}
                className={`p-6 rounded-[1.8rem] transition-all cursor-pointer ${
                  activeAyahIndex === index ? 'bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-xl scale-[1.02]' : 'bg-white/[0.03]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                   <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded-full">{ayah.numberInSurah}</span>
                   <p className={`text-3xl text-right font-arabic leading-relaxed ${activeAyahIndex === index ? 'text-emerald-400 font-bold' : 'text-white'}`} dir="rtl">
                    {ayah.text}
                  </p>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed italic">{ayah.translation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}