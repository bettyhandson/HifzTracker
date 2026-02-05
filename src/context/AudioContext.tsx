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

  // Initialize Audio Element once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }
  }, []);

  // Update playback rate whenever it changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const playAyah = async (index: number, ayahs: any[], reciter: string) => {
    if (!audioRef.current) return;

    const ayah = ayahs[index];
    const audioUrl = `https://cdn.islamic.network/quran/audio/64/${reciter}/${ayah.number}.mp3`;

    // 🚀 Force iOS to recognize a new source load
    audioRef.current.pause();
    audioRef.current.src = audioUrl;
    audioRef.current.load();
    
    setActiveAyahIndex(index);
    setPlaylist(ayahs);

    try {
      await audioRef.current.play(); // 🚀 Await is required for iOS
      setIsPlaying(true);
    } catch (err) {
      console.error("Playback failed, retrying...", err);
      // Fallback: iOS sometimes requires a direct play call after a user gesture
      audioRef.current.play();
      setIsPlaying(true);
    }

    // Handle Auto-Play next Ayah
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
      audioRef.current.play();
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