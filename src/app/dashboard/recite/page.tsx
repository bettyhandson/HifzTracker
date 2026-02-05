'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import QuranReader from "@/components/dashboard/QuranReader";
import { BookOpen, Loader2 } from "lucide-react";

export default function RecitePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user ? user.id : 'guest');
      setLoading(false);
    }
    checkUser();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
      <div className="flex flex-col xl:grid xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="px-1">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Focused Recitation</h1>
            <p className="text-slate-400 text-sm">Read carefully, log instantly, grow spiritually.</p>
          </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="h-12 w-12 text-emerald-500" />
            </div>
            <h4 className="font-bold text-emerald-500 text-sm mb-2 uppercase tracking-widest">Hifz Strategy</h4>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Recite the Surah once from the Mushaf, then once from memory."
            </p>
          </div>
          <QuranReader userId={userId || 'guest'} />
          </div>
          </div>
  );
}