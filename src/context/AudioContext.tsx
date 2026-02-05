'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Track {
  surah: number;
  ayah: number;
  number: number;
}

interface AudioContextType {
  isPlaying: boolean;
  activeAyahIndex: number;
  playlist: Track[];
  toggleAudio: () => void;
  playAyah: (index: number, ayahs: Track[], reciter: string) => void;
  playbackRate: number;
  setRate: (rate: number) => void;
  isLooping: boolean;
  setLooping: (val: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [activeAyahIndex, setActiveAyahIndex] = useState(0);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 1. Ref to hold the Web Audio Context for unlocking iOS/PWA audio
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    // Initialize AudioContext lazily (but it stays suspended until resumed)
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContextRef.current = new AudioCtx();
    }

    const handleEnded = () => {
      if (isLooping) {
        audioRef.current!.currentTime = 0;
        audioRef.current!.play().catch(() => {});
      } else {
        window.dispatchEvent(new CustomEvent('ayah-ended-globally'));
      }
    };
    audioRef.current.addEventListener('ended', handleEnded);
    return () => audioRef.current?.removeEventListener('ended', handleEnded);
  }, [isLooping]);

  // 2. The Unlock Helper Logic
  const ensureAudioUnlocked = async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    const handleGlobalNext = () => {
      setActiveAyahIndex((prev) => {
        if (prev < playlist.length - 1) {
          const nextIndex = prev + 1;
          if (audioRef.current) {
            audioRef.current.src = `https://cdn.islamic.network/quran/audio/64/${reciter}/${playlist[nextIndex].number}.mp3`;
            // Note: Global transitions don't need resume() because the 
            // session was already unlocked by the initial user click.
            audioRef.current.play().catch(() => {});
          }
          return nextIndex;
        }
        setIsPlaying(false);
        return prev;
      });
    };
    window.addEventListener('ayah-ended-globally', handleGlobalNext);
    return () => window.removeEventListener('ayah-ended-globally', handleGlobalNext);
  }, [playlist, reciter]);

  const playAyah = async (index: number, ayahs: Track[], reciterName: string) => {
    if (!audioRef.current) return;

    // 🚀 Unlock Audio for iOS/PWAs
    await ensureAudioUnlocked();

    setPlaylist(ayahs);
    setActiveAyahIndex(index);
    setReciter(reciterName);
    
    audioRef.current.pause();
    const audioUrl = `https://cdn.islamic.network/quran/audio/64/${reciterName}/${ayahs[index].number}.mp3`;
    
    audioRef.current.src = audioUrl;
    audioRef.current.load();
    audioRef.current.playbackRate = playbackRate;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn("Audio failed to play. You might be offline or interaction was blocked.", e);
      setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (!audioRef.current?.src) return;

    // 🚀 Unlock Audio for iOS/PWAs
    await ensureAudioUnlocked();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Playback failed", e);
      }
    }
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, activeAyahIndex, playlist, toggleAudio, playAyah, 
      playbackRate, setRate: (r) => { setPlaybackRate(r); if(audioRef.current) audioRef.current.playbackRate = r; }, 
      isLooping, setLooping: setIsLooping 
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};