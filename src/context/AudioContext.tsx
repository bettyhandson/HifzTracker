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
  
  // Primary audio player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Preloader to fetch the NEXT ayah ahead of time
  const preloaderRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      const preloader = new Audio();
      
      [audio, preloader].forEach(el => {
        el.preload = "auto";
        el.setAttribute('playsinline', 'true');
        el.setAttribute('webkit-playsinline', 'true');
      });

      audioRef.current = audio;
      preloaderRef.current = preloader;
    }
  }, []);

  // Professional Suggestion: Preload the next URL
  const preloadNext = (index: number, ayahs: any[], reciter: string) => {
    const nextIndex = index + 1;
    if (nextIndex < ayahs.length && preloaderRef.current) {
      const nextAyah = ayahs[nextIndex];
      preloaderRef.current.src = `https://cdn.islamic.network/quran/audio/64/${reciter}/${nextAyah.number}.mp3`;
      preloaderRef.current.load();
    }
  };

  const playAyah = async (index: number, ayahs: any[], reciter: string) => {
    if (!audioRef.current || !ayahs[index]) return;

    const ayah = ayahs[index];
    const audioUrl = `https://cdn.islamic.network/quran/audio/64/${reciter}/${ayah.number}.mp3`;

    // Reset listener to prevent memory leaks and double triggers
    audioRef.current.onended = null;

    try {
      // Logic for seamless transition
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
      
      audioRef.current.playbackRate = playbackRate;
      setPlaylist(ayahs);
      setActiveAyahIndex(index);

      // Critical for iOS: We must wait for the play promise
      await audioRef.current.play();
      setIsPlaying(true);

      // Start preloading the NEXT ayah immediately after current starts playing
      preloadNext(index, ayahs, reciter);

      audioRef.current.onended = () => {
        if (currentRepeatRef.current < repeatCount) {
          currentRepeatRef.current += 1;
          audioRef.current?.play().catch(console.error);
        } else {
          currentRepeatRef.current = 0;
          if (index < ayahs.length - 1) {
            // Instant transition to next index
            playAyah(index + 1, ayahs, reciter);
          } else {
            setIsPlaying(false);
            setActiveAyahIndex(null);
          }
        }
      };
    } catch (err: any) {
      console.error("Audio playback failed:", err);
      if (err.name !== 'AbortError') setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // iOS requires the play to be directly triggered by user action
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
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