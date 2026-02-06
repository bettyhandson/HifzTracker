'use client'
import { useState, useEffect } from 'react'
import { Quote } from 'lucide-react'
import { Card } from '@/components/ui/card' // Assuming shadcn/ui

// 📚 A small sample of consistent deeds Hadiths (Add as many as you like)
const HADITHS = [
  { text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", source: "Bukhari" },
  { text: "Take up good deeds only as much as you can bear, for Allah does not tire until you tire.", source: "Bukhari" },
  { text: "The best among you are those who learn the Quran and teach it.", source: "Bukhari" },
  { text: "He who recites the Quran and is proficient in it, will be with the noble and righteous scribes.", source: "Muslim" }
];

export default function MotivationCard({ profile }: { profile: any }) {
  const [dailyHadith, setDailyHadith] = useState(HADITHS[0]);

  useEffect(() => {
    // 🗓️ Logic to pick a new Hadith every day automatically
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % HADITHS.length;
    setDailyHadith(HADITHS[index]);
  }, []);

  return (
    <div className="col-span-1 md:col-span-5 lg:col-span-4 h-full">
      <Card className="bg-emerald-600 border-none p-6 h-full min-h-[240px] flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-emerald-900/20 rounded-[2rem]">
        {/* Decorative Icon */}
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <Quote className="h-24 w-24 text-white transform rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <h3 className="text-lg font-bold text-white">Did you know?</h3>
          </div>
          
          {/* 🔄 Dynamic Text Starts Here */}
          <p className="text-white text-base font-medium leading-relaxed">
            "{dailyHadith.text}"
          </p>
          <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">
            ({dailyHadith.source})
          </p>
          
          <div className="h-px w-full bg-white/20 my-4" />

          <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest flex items-center gap-2">
            Current Streak: <span className="text-white bg-white/20 px-2 py-0.5 rounded-md">{profile?.current_streak || 0} Days</span>
          </p>
        </div>
      </Card>
    </div>
  );
}