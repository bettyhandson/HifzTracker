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

  const getAudioUrl = (reciter: string, ayah: any) => {
    const surahNum = String(ayah.surah?.number || ayah.surahNumber || 1).padStart(3, '0');
    const ayahInSurahNum = String(ayah.numberInSurah || 1).padStart(3, '0');
    const fileId = `${surahNum}${ayahInSurahNum}`;

    // Precise mapping for EveryAyah directories
    const everyAyahMapping: { [key: string]: string } = {
      'Minshawy_Teacher': 'Minshawy_Teacher_128kbps',
      'ar.husary.muallim': 'Husary_Muallim_128kbps',
      'ar.alafasy': 'Alafasy_128kbps',
      'ar.abdulsamad': 'Abdul_Basit_Murattal_192kbps',
      'ar.abdullahbasfar': 'Abdullah_Basfar_192kbps',
      'ar.abdurrahmaansudais': 'Abdurrahmaan_As-Sudais_192kbps',
      'ar.mahermuaiqly': 'Maher_AlMuaiqly_64kbps'
    };

    if (everyAyahMapping[reciter]) {
      return `https://www.everyayah.com/data/${everyAyahMapping[reciter]}/${fileId}.mp3`;
    }

    // Fallback for standard API reciters
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`;
  };

  const preloadNext = (index: number, ayahs: any[], reciter: string) => {
    const nextIndex = index + 1;
    if (nextIndex < ayahs.length && preloaderRef.current) {
      preloaderRef.current.src = getAudioUrl(reciter, ayahs[nextIndex]);
      preloaderRef.current.load();
    }
  };

  const playAyah = async (index: number, ayahs: any[], reciter: string) => {
    if (!audioRef.current || !ayahs[index]) return;

    const audioUrl = getAudioUrl(reciter, ayahs[index]);
    audioRef.current.onended = null;

    try {
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
      
      audioRef.current.playbackRate = playbackRate;
      setPlaylist(ayahs);
      setActiveAyahIndex(index);

      await audioRef.current.play();
      setIsPlaying(true);
      preloadNext(index, ayahs, reciter);

      audioRef.current.onended = () => {
        if (currentRepeatRef.current < repeatCount) {
          currentRepeatRef.current += 1;
          audioRef.current?.play().catch(console.error);
        } else {
          currentRepeatRef.current = 0;
          if (index < ayahs.length - 1) {
            playAyah(index + 1, ayahs, reciter);
          } else {
            setIsPlaying(false);
            setActiveAyahIndex(null);
          }
        }
      };
    } catch (err: any) {
      console.error("Audio playback failed:", err);
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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