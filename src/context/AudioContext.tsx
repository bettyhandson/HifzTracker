'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  activeAyahIndex: number | null;
  playlist: any[];
  playbackRate: number;
  isLooping: boolean;
  setRate: (rate: number) => void;
  setLooping: (loop: boolean) => void;
  playAyah: (index: number, ayahs: any[], reciter: string) => void;
  toggleAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [playbackRate, setRate] = useState(1);
  const [isLooping, setLooping] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = "auto";
      // 🚀 Required for iOS PWA Background/Standalone playback
      audio.setAttribute('playsinline', 'true');
      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const playAyah = async (index: number, ayahs: any[], reciter: string) => {
    if (!audioRef.current) return;

    // 🚀 STEP 1: iOS Hardware Kick (Sync)
    // Claim the audio channel immediately before the URL load
    audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    try { await audioRef.current.play(); } catch (e) { /* silent fail ok */ }

    const ayah = ayahs[index];
    // High-quality bitrate often performs better on stable PWA installs
    const audioUrl = `https://cdn.islamic.network/quran/audio/64/${reciter}/${ayah.number}.mp3`;

    // 🚀 STEP 2: Load real source
    audioRef.current.pause();
    audioRef.current.src = audioUrl;
    audioRef.current.load();
    
    setActiveAyahIndex(index);
    setPlaylist(ayahs);

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      }
    }

    audioRef.current.onended = () => {
      if (isLooping) {
        audioRef.current?.play();
      } else if (index < ayahs.length - 1) {
        playAyah(index + 1, ayahs, reciter);
      } else {
        setIsPlaying(false);
        setActiveAyahIndex(null);
      }
    };
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
      isPlaying, activeAyahIndex, playlist, playbackRate, isLooping, 
      setRate, setLooping, playAyah, toggleAudio 
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