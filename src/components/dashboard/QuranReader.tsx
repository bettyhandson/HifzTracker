'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Loader2, Play, Pause, Languages, Repeat, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from '@/context/AudioContext';

export default function QuranReader({ userId }: { userId: string }) {
  const { isPlaying, toggleAudio, playAyah, activeAyahIndex, playlist, playbackRate, setRate, isLooping, setLooping } = useAudio();
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [ayahs, setAyahs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [preferredReciter, setPreferredReciter] = useState('ar.alafasy'); 
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 🚀 iOS PWA UNLOCK: Master handler to resume audio context
  const handleMasterPlay = async (index?: number) => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const tempCtx = new AudioContextClass();
        if (tempCtx.state === 'suspended') await tempCtx.resume();
      }
    } catch (e) {
      console.warn("Hardware busy");
    }

    if (index !== undefined) {
      playAyah(index, ayahs, preferredReciter);
    } else {
      if (isPlaying) {
        toggleAudio();
      } else {
        const target = (typeof activeAyahIndex === 'number') ? activeAyahIndex : 0;
        playAyah(target, ayahs, preferredReciter);
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      // 🚀 FIX: Prevent Supabase 400 error for Guest users
      if (!userId || userId === 'guest') return;

      const { data } = await supabase
        .from('profiles')
        .select('preferred_reciter')
        .eq('id', userId)
        .single();
        
      if (data?.preferred_reciter) setPreferredReciter(data.preferred_reciter);
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah').then(res => res.json()).then(data => { if (data.data) setSurahs(data.data); });
  }, []);

  useEffect(() => {
    const cacheKey = `surah_${selectedSurah}`;
    const cachedData = localStorage.getItem(cacheKey);

    setLoading(true);
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/quran-uthmani,en.sahih`)
      .then(res => res.json())
      .then(data => {
        if (data.data?.[0]) {
          const verses = data.data[0].ayahs.map((v: any, i: number) => ({ 
            ...v, translation: data.data[1].ayahs[i].text, surah: selectedSurah 
          }));
          setAyahs(verses);
          localStorage.setItem(cacheKey, JSON.stringify(verses));
        }
        setLoading(false);
      })
      .catch(() => {
        if (cachedData) setAyahs(JSON.parse(cachedData));
        setLoading(false);
      });
  }, [selectedSurah]);

  useEffect(() => {
    if (isPlaying && playlist[0]?.surah === selectedSurah && typeof activeAyahIndex === 'number') {
      ayahRefs.current[activeAyahIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAyahIndex, isPlaying, selectedSurah, playlist]);

  return (
    <Card className="bg-[#0a0a0a] border-white/5 overflow-hidden flex flex-col h-[75vh] md:h-[85vh]">
      <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            onClick={() => handleMasterPlay()} 
            variant="ghost" 
            className={`rounded-full w-10 h-10 p-0 ${isPlaying ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500/10 text-emerald-500'}`}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" onClick={() => setLooping(!isLooping)} className={`rounded-lg h-10 w-10 ${isLooping ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500'}`}><Repeat className="h-5 w-5" /></Button>
          <div className="relative group flex items-center h-10 w-10 justify-center">
             <Gauge className="h-5 w-5 text-slate-500" />
             <select value={playbackRate} onChange={(e) => setRate(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer">
                {[0.5, 1, 1.5, 2].map(r => <option key={r} value={r}>{r}x</option>)}
             </select>
          </div>
          <Button variant="ghost" onClick={() => setShowTranslation(!showTranslation)} className={`rounded-lg h-10 w-10 ${showTranslation ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500'}`}><Languages className="h-5 w-5" /></Button>
        </div>
        <select value={selectedSurah} onChange={(e) => setSelectedSurah(Number(e.target.value))} className="bg-slate-900 text-white border border-white/10 rounded-lg px-2 py-1.5 text-sm outline-none w-24 sm:w-44">
          {surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>)}
        </select>
      </div>
      <div className="flex-1 p-4 md:p-12 overflow-y-auto space-y-12 scrollbar-hide bg-[#0a0a0a]">
        {loading ? ( <div className="flex flex-col items-center justify-center h-full"><Loader2 className="h-8 w-8 text-emerald-500 animate-spin" /></div> ) : (
          <div className="max-w-4xl mx-auto space-y-16 pb-32">
            {ayahs.map((ayah, index) => (
              <div 
                key={ayah.number} 
                ref={el => { ayahRefs.current[index] = el; }} 
                className={`text-right p-6 rounded-3xl transition-all cursor-pointer ${activeAyahIndex === index ? 'bg-emerald-500/[0.04] ring-1 ring-emerald-500/20' : ''}`} 
                onClick={() => handleMasterPlay(index)}
              >
                <p className={`text-3xl md:text-5xl leading-relaxed font-arabic ${activeAyahIndex === index ? 'text-emerald-400' : 'text-white/90'}`} dir="rtl">
                  {ayah.text} <span className="inline-flex items-center justify-center w-10 h-10 border rounded-full text-sm mr-4">{ayah.numberInSurah}</span>
                </p>
                {showTranslation && <p className="text-left text-slate-400 mt-4 text-sm md:text-base">{ayah.translation}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}