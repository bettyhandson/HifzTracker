'use client';

import { useState, useMemo } from 'react'; // Added useMemo
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { findSurah, SURAHS } from '@/lib/quran'; 

export default function LogProgressForm({ userId }: { userId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [surahInput, setSurahInput] = useState(''); 
  const [startAyah, setStartAyah] = useState('');
  const [endAyah, setEndAyah] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false); // 🚀 New state

  // 🚀 Logic for Autocomplete Suggestions
  const filteredSurahs = useMemo(() => {
    if (surahInput.length < 2) return [];
    return SURAHS.filter(s => 
      s.name.toLowerCase().includes(surahInput.toLowerCase()) || 
      s.id.toString().includes(surahInput)
    ).slice(0, 5);
  }, [surahInput]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const surahData = findSurah(surahInput);
    
    if (!surahData) {
      alert("Please enter a valid Surah name or number.");
      setLoading(false);
      return;
    }

    const logEntry = {
      surah_number: surahData.id,
      surah_name: surahData.name,
      ayah_start: parseInt(startAyah),
      ayah_end: parseInt(endAyah),
      created_at: new Date().toISOString(),
    };

    if (userId === 'guest') {
      const existingLogs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
      localStorage.setItem('hifz_progress_logs', JSON.stringify([logEntry, ...existingLogs]));
      
      const profileData = JSON.parse(localStorage.getItem('hifz_tracker_data') || '{}');
      const totalAyahs = (parseInt(endAyah) - parseInt(startAyah) + 1);
      
      localStorage.setItem('hifz_tracker_data', JSON.stringify({
        ...profileData,
        lastSurah: surahData.name,
        totalAyahs: (profileData.totalAyahs || 0) + totalAyahs,
      }));

      setSurahInput(''); setStartAyah(''); setEndAyah('');
      alert(`Progress logged for ${surahData.name}!`);
      window.location.reload(); 
    } else {
      const { error } = await supabase.from('progress_logs').insert([{ user_id: userId, ...logEntry }]);
      if (error) {
        alert(error.message);
      } else {
        setSurahInput(''); setStartAyah(''); setEndAyah('');
        router.refresh();
        alert(`Alhamdulillah! Progress logged for ${surahData.name}.`);
      }
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
            {/* Surah Input with Dropdown */}
            <div className="col-span-3 sm:col-span-1 space-y-2 relative">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surah Name or No.</Label>
              <Input 
                type="text" 
                placeholder="e.g. 2 or Baqarah" 
                value={surahInput} 
                onChange={(e) => {
                   setSurahInput(e.target.value);
                   setShowSuggestions(true);
                }} 
                onFocus={() => setShowSuggestions(true)}
                required 
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium"
              />

              {/* 🚀 Suggestions List */}
              {showSuggestions && filteredSurahs.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                   {filteredSurahs.map((s) => (
                     <button
                        key={s.id}
                        type="button"
                        className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors flex justify-between items-center"
                        onClick={() => {
                          setSurahInput(s.name);
                          setShowSuggestions(false);
                        }}
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
              <Input type="number" inputMode="numeric" placeholder="From" value={startAyah} onChange={(e) => setStartAyah(e.target.value)} required className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium" />
            </div>

            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Ayah</Label>
              <Input type="number" inputMode="numeric" placeholder="To" value={endAyah} onChange={(e) => setEndAyah(e.target.value)} required className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? 'Logging Deeds...' : <><CheckCircle2 className="h-5 w-5" /> Save Reading Session</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}