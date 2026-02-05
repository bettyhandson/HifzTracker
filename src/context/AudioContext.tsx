'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  activeAyahIndex: number | null;
  playlist: any[];
  playbackRate: number;
  repeatCount: number;
  setRepeatCount: (count: number) => void;
  playAyah: (index: number, ayahs: any[], reciter: string) => void;
  toggleAudio: () => void;
  setRate: (rate: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [playbackRate, setRate] = useState(1);
  const [repeatCount, setRepeatCount] = useState(0); 
  const currentRepeatRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = "auto";
      audio.setAttribute('playsinline', 'true'); // Required for iOS PWA
      audioRef.current = audio;
    }
  }, []);

  const playAyah = async (index: number, ayahs: any[], reciter: string) => {
    if (!audioRef.current || !ayahs[index]) return;

    const ayah = ayahs[index];
    const audioUrl = `https://cdn.islamic.network/quran/audio/64/${reciter}/${ayah.number}.mp3`;

    audioRef.current.onended = null;

    try {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      
      setPlaylist(ayahs);
      setActiveAyahIndex(index);

      await audioRef.current.play(); // 🚀 Critical for iOS
      setIsPlaying(true);

      audioRef.current.onended = () => {
        if (currentRepeatRef.current < repeatCount) {
          currentRepeatRef.current += 1;
          audioRef.current?.play();
        } else {
          currentRepeatRef.current = 0;
          if (index < ayahs.length - 1) {
            playAyah(index + 1, ayahs, reciter); // 🚀 Automatic transition
          } else {
            setIsPlaying(false);
            setActiveAyahIndex(null);
          }
        }
      };
    } catch (err: any) {
      if (err.name !== 'AbortError') setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, activeAyahIndex, playlist, playbackRate, repeatCount,
      setRepeatCount, playAyah, toggleAudio, setRate 
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};