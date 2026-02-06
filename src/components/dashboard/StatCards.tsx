'use client';

import { Card } from "@/components/ui/card";
import { TrendingUp, Flame, CheckCircle } from "lucide-react";

export default function StatCards({ profile }: { profile: any }) {
  // 🚀 Logic: Use the profile name we passed from the dashboard
  const isGuest = profile?.isGuest;
  
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {/* 1. Portfolio Value Card */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] border border-emerald-500/20 p-5 md:p-6 flex flex-col gap-4 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-slate-300 text-xs md:text-sm font-medium">Portfolio Value (Deeds)</span>
          <TrendingUp className="text-emerald-500 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
        </div>
        <div className="space-y-2">
          {/* If guest, we could calculate total ayahs from localStorage logs here */}
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {/* 🚀 FIXED: Added the missing closing parenthesis below */}
            {isGuest ? (profile?.total_ayahs_read || 0) : (profile?.total_ayahs_read || 0)} <span className="text-lg md:text-2xl text-slate-400">Total Ayah</span>
          </h3>
          <p className="text-emerald-400 text-xs font-medium">Unrealised return: Eternity Rewards</p>
        </div>
      </Card>

      {/* 2. Current Streak Card */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] border border-emerald-500/20 p-5 md:p-6 flex flex-col gap-4 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-slate-300 text-xs md:text-sm font-medium">Current Streak</span>
          <Flame className="text-emerald-400 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {profile?.current_streak || 0} <span className="text-lg md:text-2xl text-slate-400">Days</span>
          </h3>
          <p className="text-slate-400 text-xs font-medium">Keep it up for Ramadan</p>
        </div>
      </Card>

      {/* 3. Daily Target Card */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] border border-emerald-500/20 p-5 md:p-6 flex flex-col gap-4 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-slate-300 text-xs md:text-sm font-medium">Daily Target</span>
          <CheckCircle className="text-emerald-500 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {profile?.daily_goal_ayahs || 0} <span className="text-lg md:text-2xl text-slate-400">Ayahs</span>
          </h3>
          <p className="text-slate-400 text-xs font-medium">Goal: Consistency</p>
        </div>
      </Card>
    </div>
  );
}