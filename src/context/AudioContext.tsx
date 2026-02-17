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

  // Use a ref for the latest state to access inside the onended listener
  const stateRef = useRef({ activeAyahIndex, playlist, repeatCount, isPlaying });

  useEffect(() => {
    stateRef.current = { activeAyahIndex, playlist, repeatCount, isPlaying };
  }, [activeAyahIndex, playlist, repeatCount, isPlaying]);

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

      // Handle the transition automatically inside the Audio object listener
      // This is more reliable in the background than React state-driven triggers
      audio.onended = () => {
        const { activeAyahIndex: currentIndex, playlist: currentList, repeatCount: currentRepeat, isPlaying: wasPlaying } = stateRef.current;
        
        if (!wasPlaying || currentIndex === null) return;

        if (currentRepeatRef.current < currentRepeat) {
          currentRepeatRef.current += 1;
          audio.play().catch(() => {});
        } else {
          currentRepeatRef.current = 0;
          const nextIndex = currentIndex + 1;
          if (nextIndex < currentList.length) {
            // Trigger next ayah immediately
            playAyah(nextIndex, currentList, (audio as any).currentReciter);
          } else {
            setIsPlaying(false);
            setActiveAyahIndex(null);
          }
        }
      };

      const handleVisibilityChange = () => {
        if (document.hidden && stateRef.current.isPlaying) {
          audioRef.current?.play().catch(() => {});
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, []);

  const updateMediaSession = (ayah: any, reciter: string) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Ayah ${ayah.numberInSurah}`,
        artist: reciter.split('.').pop()?.replace('_', ' ') || 'Quran Reciter',
        album: `Surah ${ayah.surahNumber || 'Quran'}`,
        artwork: [
          { src: '/favicon.ico', sizes: '192x192', type: 'image/x-icon' },
          { src: 'https://static.quran.com/images/logo.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => toggleAudio());
      navigator.mediaSession.setActionHandler('pause', () => toggleAudio());
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        const { activeAyahIndex: idx, playlist: list } = stateRef.current;
        if (idx !== null && idx < list.length - 1) {
          playAyah(idx + 1, list, reciter);
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        const { activeAyahIndex: idx, playlist: list } = stateRef.current;
        if (idx !== null && idx > 0) {
          playAyah(idx - 1, list, reciter);
        }
      });
    }
  };

  const getAudioUrl = (reciter: string, ayah: any) => {
    const surahNum = String(ayah.surah?.number || ayah.surahNumber || 1).padStart(3, '0');
    const ayahInSurahNum = String(ayah.numberInSurah || 1).padStart(3, '0');
    const fileId = `${surahNum}${ayahInSurahNum}`;

    const everyAyahMapping: { [key: string]: string } = {
      'Minshawy_Teacher': 'Minshawy_Teacher_128kbps',
      'Husary_Muallim_128kbps': 'Husary_Muallim_128kbps',
      'Alafasy_128kbps': 'Alafasy_128kbps',
      'ar.english.basfar': 'MultiLanguage/Basfar_Walk_192kbps', 
      'ar.minshawi.teacher': 'Minshawy_Teacher_128kbps',
      'ar.husary.muallim': 'Husary_Muallim_128kbps',
      'ar.alafasy': 'Alafasy_128kbps',
      'ar.abdulsamad': 'Abdul_Basit_Murattal_192kbps',
      'ar.abdullahbasfar': 'Abdullah_Basfar_192kbps',
      'ar.abdurrahmaansudais': 'Abdurrahmaan_As-Sudais_192kbps',
      'ar.mahermuaiqly': 'Maher_AlMuaiqly_64kbps'
    };

    const folder = everyAyahMapping[reciter] || 'Minshawy_Teacher_128kbps';
    return `https://www.everyayah.com/data/${folder}/${fileId}.mp3`;
  };

  const preloadNext = (index: number, ayahs: any[], reciter: string) => {
    const nextIndex = index + 1;
    if (nextIndex < ayahs.length && preloaderRef.current) {
      const nextUrl = getAudioUrl(reciter, ayahs[nextIndex]);
      preloaderRef.current.src = nextUrl;
      preloaderRef.current.load();
    }
  };

  const playAyah = async (index: number, ayahs: any[], reciter: string) => {
    if (!audioRef.current || !ayahs[index]) return;

    const audioUrl = getAudioUrl(reciter, ayahs[index]);
    
    // Store reciter on the audio object so the onended listener can access it
    (audioRef.current as any).currentReciter = reciter;

    try {
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
      
      audioRef.current.playbackRate = playbackRate;
      
      // Update states
      setPlaylist(ayahs);
      setActiveAyahIndex(index);
      setIsPlaying(true);

      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updateMediaSession(ayahs[index], reciter);
          preloadNext(index, ayahs, reciter);
        }).catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          }
        });
      }
    } catch (err: any) {
      console.error("Audio playback failed:", err);
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (stateRef.current.isPlaying) {
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