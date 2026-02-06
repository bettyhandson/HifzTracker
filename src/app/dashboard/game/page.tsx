'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Trophy, CheckCircle2, XCircle, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GAME_DATA } from '@/data/gameData'
import { createClient } from '@/utils/supabase/client' // 1. Add this import

export default function IslamicGamePage() {
  const router = useRouter()
  const supabase = createClient() // 2. Initialize client
  
  const startDate = new Date('2026-02-17').getTime();
  const today = new Date().getTime();
  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const currentDay = diffDays >= 1 && diffDays <= 30 ? diffDays : 1;

  const todaysQuestions = GAME_DATA[currentDay] || GAME_DATA[1];

  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [isFinished, setIsFinished] = useState(false)

  const level = todaysQuestions[currentLevel]

  // 3. Database Sync Logic
  const saveProgressToDatabase = async (finalScore: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Fetch current XP first to add to it
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp, last_game_day')
        .eq('id', user.id)
        .single();

      // Only update if they haven't already saved today's score
      if (profile && profile.last_game_day !== currentDay) {
        await supabase
          .from('profiles')
          .update({ 
            total_xp: (profile.total_xp || 0) + finalScore,
            last_game_day: currentDay 
          })
          .eq('id', user.id);
      }
    }
  }

  const handleChoice = (choice: string) => {
    setSelected(choice)
    if (choice === level.missing_word) {
      setStatus('correct')
      const newScore = score + 10
      setScore(newScore)
      
      setTimeout(() => {
        if (currentLevel < todaysQuestions.length - 1) {
          setCurrentLevel(c => c + 1)
          setSelected(null)
          setStatus('idle')
        } else {
          setIsFinished(true)
          saveProgressToDatabase(newScore) // 4. Save to DB only when all 5 are done
        }
      }, 1500)
    } else {
      setStatus('wrong')
      setTimeout(() => {
        setSelected(null)
        setStatus('idle')
      }, 1000)
    }
  }

  // ... (Your existing return and Success Screen code remains exactly the same)

  // 🎉 SUCCESS SCREEN COMPONENT
  if (isFinished) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 bg-emerald-500/20 p-6 rounded-full">
          <PartyPopper size={60} className="text-emerald-500" />
        </motion.div>
        <h1 className="text-4xl font-black mb-2 text-white">MASHALLAH!</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">You've completed all Day {currentDay} challenges.<br/>Come back tomorrow for new verses!</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-emerald-600 w-full max-w-xs py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/20"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* HEADER (Same Layout) */}
      <header className="p-4 bg-[#111] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full">
            <ChevronLeft className="text-emerald-500" />
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-none italic">Day {currentDay}</h1>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Challenge {currentLevel + 1} of 5</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2">
          <Trophy size={14} className="text-emerald-500" />
          <span className="text-sm font-black text-emerald-500">{score}</span>
        </div>
      </header>

      {/* GAME AREA */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentLevel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md bg-[#161616] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative mb-8"
          >
            <p className="text-3xl md:text-4xl font-arabic text-center leading-[2] mb-6 pt-4">
              {level.ayah_ar.split('____').map((part, i) => (
                <span key={i}>
                  {part}
                  {i === 0 && (
                    <span className={`mx-2 border-b-2 px-2 min-w-[100px] inline-block transition-all ${status === 'correct' ? 'text-emerald-500 border-emerald-500' : 'text-slate-700 border-slate-700'}`}>
                      {status === 'correct' ? level.missing_word : '...'}
                    </span>
                  )}
                </span>
              ))}
            </p>
            <p className="text-slate-500 text-xs text-center italic border-t border-white/5 pt-4 uppercase tracking-tighter">
              {level.surah} • {level.translation}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="w-full max-w-md grid grid-cols-1 gap-3">
          {level.options.map((option) => (
            <motion.button
              key={option}
              whileTap={{ scale: 0.97 }}
              onClick={() => status === 'idle' && handleChoice(option)}
              className={`p-5 rounded-[1.5rem] font-arabic text-xl transition-all border flex items-center justify-between
                ${selected === option 
                  ? (status === 'correct' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400')
                  : 'bg-[#1a1a1a] border-white/5 text-slate-400 hover:border-emerald-500/50'
                }`}
            >
              {option}
              {selected === option && (status === 'correct' ? <CheckCircle2 size={20} /> : <XCircle size={20} />)}
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  )
}