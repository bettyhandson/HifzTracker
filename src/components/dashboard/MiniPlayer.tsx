'use client';

import { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, ChevronRight, ChevronLeft, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mapping table to convert surah numbers to names since the API object is missing them
const surahMapping: { [key: number]: string } = {
  1: "Al-Fatihah",
2: "Al-Baqarah",
3: "Ali 'Imran",
4: "An-Nisa",
5: "Al-Ma'idah",
6: "Al-An'am",
7: "Al-A'raf",
8: "Al-Anfal",
9: "At-Tawbah",
10: "Yunus",
11: "Hud",
12: "Yusuf",
13: "Ar-Ra'd",
14: "Ibrahim",
15: "Al-Hijr",
16: "An-Nahl",
17: "Al-Isra",
18: "Al-Kahf",
19: "Maryam",
20: "Ta-Ha",
21: "Al-Anbiya",
22: "Al-Hajj",
23: "Al-Mu'minun",
24: "An-Nur",
25: "Al-Furqan",
26: "Ash-Shu'ara",
27: "An-Naml",
28: "Al-Qasas",
29: "Al-'Ankabut",
30: "Ar-Rum",
31: "Luqman",
32: "As-Sajdah",
33: "Al-Ahzab",
34: "Saba",
35: "Fatir",
36: "Ya-Sin",
37: "As-Saffat",
38: "Sad",
39: "Az-Zumar",
40: "Ghafir",
41: "Fussilat",
42: "Ash-Shura",
43: "Az-Zukhruf",
44: "Ad-Dukhan",
45: "Al-Jathiyah",
46: "Al-Ahqaf",
47: "Muhammad",
48: "Al-Fath",
49: "Al-Hujurat",
50: "Qaf",
51: "Adh-Dhariyat",
52: "At-Tur",
53: "An-Najm",
54: "Al-Qamar",
55: "Ar-Rahman",
56: "Al-Waqi'ah",
57: "Al-Hadid",
58: "Al-Mujadila",
59: "Al-Hashr",
60: "Al-Mumtahanah",
61: "As-Saff",
62: "Al-Jumu'ah",
63: "Al-Munafiqun",
64: "At-Taghabun",
65: "At-Talaq",
66: "At-Tahrim",
67: "Al-Mulk",
68: "Al-Qalam",
69: "Al-Haqqah",
70: "Al-Ma'arij",
71: "Nuh",
72: "Al-Jinn",
73: "Al-Muzzammil",
74: "Al-Muddaththir",
75: "Al-Qiyamah",
76: "Al-Insan",
77: "Al-Mursalat",
78: "An-Naba",
79: "An-Nazi'at",
80: "Abasa",
81: "At-Takwir",
82: "Al-Infitar",
83: "Al-Mutaffifin",
84: "Al-Inshiqaq",
85: "Al-Buruj",
86: "At-Tariq",
87: "Al-A'la",
88: "Al-Ghashiyah",
89: "Al-Fajr",
90: "Al-Balad",
91: "Ash-Shams",
92: "Al-Layl",
93: "Ad-Duha",
94: "Ash-Sharh",
95: "At-Tin",
96: "Al-'Alaq",
97: "Al-Qadr",
98: "Al-Bayyinah",
99: "Az-Zalzalah",
100: "Al-'Adiyat",
101: "Al-Qari'ah",
102: "At-Takathur",
103: "Al-'Asr",
104: "Al-Humazah",
105: "Al-Fil",
106: "Quraysh",
107: "Al-Ma'un",
108: "Al-Kawthar",
109: "Al-Kafirun",
110: "An-Nasr",
111: "Al-Masad",
112: "Al-Ikhlas",
113: "Al-Falaq",
114: "An-Nas",
};

export default function MiniPlayer() {
  const { isPlaying, activeAyahIndex, playlist, toggleAudio } = useAudio();
  const [isMinimized, setIsMinimized] = useState(false);

  if (activeAyahIndex === null || !playlist[activeAyahIndex]) return null;
  
  const currentAyah = playlist[activeAyahIndex];

  /** * LOGIC TO GET NAME:
   * 1. Try to get it from the object directly (if it exists)
   * 2. If not, look at surahNumber or surah.number and find it in our mapping
  **/
  const sNum = currentAyah.surah?.number || currentAyah.surahNumber || 0;
  const surahName = currentAyah.surah?.englishName || surahMapping[sNum] || `Surah ${sNum}`;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: 300, opacity: 0 }}
        animate={{ 
          x: isMinimized ? 'calc(100% - 60px)' : 0, 
          opacity: 1 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-24 right-4 z-[100] w-[calc(100%-2rem)] md:w-80"
      >
        <div className="bg-[#121212]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center overflow-hidden h-20">
          
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex-shrink-0 w-10 h-full flex items-center justify-center bg-white/5 hover:bg-emerald-500/10 transition-colors border-r border-white/5"
          >
            {isMinimized ? (
              <ChevronLeft className="h-5 w-5 text-emerald-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-500" />
            )}
          </button>

          <div className="flex items-center justify-between w-full px-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Music className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mb-1">
                  Now Reciting
                </h4>
                <p className="text-xs font-medium text-white truncate">
                  {surahName} — Ayah {currentAyah.numberInSurah}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  القرآن الكريم
                </p>
              </div>
            </div>

            <button 
              onClick={toggleAudio}
              className="h-10 w-10 rounded-full bg-emerald-500 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-slate-950 flex-shrink-0"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-0.5 bg-emerald-500/30 w-full">
             <motion.div 
               className="h-full bg-emerald-500" 
               initial={{ width: 0 }}
               animate={{ width: isPlaying ? '100%' : '0%' }}
             />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}