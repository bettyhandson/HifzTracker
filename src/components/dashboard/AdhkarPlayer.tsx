'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Play, Pause, Music, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from '@/context/AudioContext';
import { toast } from "sonner";

// Define your local Adhkar files here
const ADHKAR_DATA = [
  { id: 'morning', title: 'Morning Adhkar', duration: '21:05', file: '/audio/morning.mp3' },
  { id: 'evening', title: 'Evening Adhkar', duration: '20:57', file: '/audio/evening.mp3' },
  { id: 'hifz-dua', title: 'Dua for Hifz', duration: '08:54', file: '/audio/hifz-dua.mp3' },
];

export default function AdhkarPlayer() {
  const { isPlaying, toggleAudio, playAyah, activeAyahIndex } = useAudio();
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  // 🚀 iOS PWA UNLOCK: Hardware wake-up for local files
  const handleAdhkarPlay = async (file: string) => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const tempCtx = new AudioContextClass();
        if (tempCtx.state === 'suspended') await tempCtx.resume();
      }
    } catch (e) {
      console.warn("Hardware busy");
    }

    // Since playAyah is built for Quran API, we pass a custom "ayah-like" object 
    // or we can trigger the global toggle if the file is already loaded.
    if (currentFile === file && isPlaying) {
      toggleAudio();
    } else {
      setCurrentFile(file);
      // We pass the local file to the global player logic
      // Note: Ensure your AudioContext.tsx playAyah logic handles local strings!
      playAyah(0, [{ number: 0, text: '', file: file }], 'local'); 
      toast.success(`Starting ${file.replace('/audio/', '').replace('.mp3', '')}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Headphones className="h-5 w-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-white">Adhkar & Duas</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {ADHKAR_DATA.map((adhkar) => (
          <Card 
            key={adhkar.id} 
            className={`p-4 bg-white/[0.03] border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer ${currentFile === adhkar.file && isPlaying ? 'ring-1 ring-emerald-500/30 bg-emerald-500/[0.02]' : ''}`}
            onClick={() => handleAdhkarPlay(adhkar.file)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${currentFile === adhkar.file && isPlaying ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400'}`}>
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{adhkar.title}</h4>
                  <p className="text-xs text-slate-500">{adhkar.duration}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${currentFile === adhkar.file && isPlaying ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                {currentFile === adhkar.file && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}