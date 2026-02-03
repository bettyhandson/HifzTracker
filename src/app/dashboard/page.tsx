import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCards from "@/components/dashboard/StatCards";
import LogProgressForm from "@/components/dashboard/LogProgressForm";
import ReadingHistory from "@/components/dashboard/ReadingHistory";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import IslamicCalendar from "@/components/dashboard/IslamicCalendar";


export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch the user's brand-specific profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white-900">
            Assalamu Alaikum, <span className="text-white-900">{profile?.full_name || 'Brother/Sister'}</span>
          </h1>
          <p className="text-slate-500">
            Track your journey. Your consistency today is your reward for eternity.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 🌙 Main Calendar Section */}
      <div className="lg:col-span-2 space-y-6">
        <IslamicCalendar />
        {/* Your current Hifz stats/charts go here */}
      </div>

      {/* 📊 Sidebar Widget (Stats or Donations) */}
      <div className="space-y-6">
        {/* Your Donation Progress Bar Widget */}
      </div>
    </div>
       {/* 3. Quick Tips/Hadith Card (Maintains Brand Consistency) */}
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">Did you know?</h3>
              <p className="text-emerald-50 text-sm italic">
                "The most beloved of deeds to Allah are those that are most consistent, even if they are small." 
                (Bukhari)
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white-500/50">
              <p className="text-xs text-emerald-100">
                You are currently on a <span className="font-bold">{profile?.current_streak || 0} day</span> streak. 
                Keep it going!
              </p>
            </div>
          </div>
        {/* 1. Stat Cards Section (The "Fintech" Logic with your Emerald Brand) */}
        <StatCards profile={profile} />
        {/* 2. Main Action Area: Logging Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LogProgressForm userId={user.id} />
          </div>
          </div>
               {/* PLACE HISTORY BELOW THE FORM */}
        {/* 4. Placeholder for Heatmap/Wave Chart (Coming Next) */}
      <div className="space-y-8">
      <ActivityHeatmap userId={user.id} />
      </div>
      </div>
    </DashboardShell>
  );
}