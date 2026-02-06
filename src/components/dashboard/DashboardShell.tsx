'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { BookOpen, LayoutDashboard, Settings, LogOut, Menu, Trophy, Sparkles, Heart, BookAlert, BookCheckIcon, HistoryIcon, Goal, Gamepad, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from '@/lib/supabase';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'My Quran', icon: BookCheckIcon, href: '/dashboard/recite' }, 
  {name:  'Adhkar', icon: BookAlert, href: '/dashboard/adhkar' },
  { name: 'Hifz Logs', icon: HistoryIcon, href: '/dashboard/logs' },
  {name: 'Game Zone', icon: Gamepad, href: '/dashboard/game' },
  { name: 'Support Mission', icon: Heart, href: '/dashboard/donate' },
  { name: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard' },
  { name: 'Achievements', icon: Goal, href: '/dashboard/awards' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); 
  const [isOpen, setIsOpen] = useState(false);

  // --- Ramadan Countdown Logic ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });
  
  useEffect(() => {
    const target = new Date('2026-02-18T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🚀 Logic to prevent global pull-to-refresh from triggering inside sidebars
  const preventRefresh = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const CountdownWidget = () => (
    <div className="mt-auto px-2 py-4">
      <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Ramadan 2026</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none">{timeLeft.days}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Days</p>
          </div>
          <div className="text-slate-700 font-bold">:</div>
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none">{timeLeft.hours}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Hrs</p>
          </div>
          <div className="text-slate-700 font-bold">:</div>
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none">{timeLeft.mins}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Mins</p>
          </div>
        </div>
      </div>
    </div>
  );

  const CommunityButton = () => (
    <a 
      href="https://chat.whatsapp.com/LMWf8gHJtn8HL6uX7MPovE" 
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all mb-2 group"
    >
      <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-black uppercase tracking-widest">Join Community</span>
        <span className="text-[9px] text-emerald-500/60 font-medium tracking-tight">Connect with the Ummah</span>
      </div>
    </a>
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setIsOpen(false);
      router.push("/login");
      router.refresh();
    }
  };

  const NavLink = ({ item }: { item: typeof menuItems[0] }) => (
    <Link 
      href={item.href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        pathname === item.href 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.name}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Desktop Sidebar */}
      <aside 
        onTouchStart={preventRefresh}
        onTouchMove={preventRefresh}
        style={{ overscrollBehaviorY: 'contain' }}
        className="hidden md:flex w-64 flex-col border-r border-emerald-500/20 bg-slate-900/50 backdrop-blur sticky top-0 h-screen overflow-hidden"
      >
        <div className="p-6 flex items-center gap-3 font-bold text-emerald-400 text-xl mb-6 shrink-0">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <span>HifzTracker</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-6 space-y-3 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-6 border-t border-emerald-500/10 mt-auto bg-slate-900/40">
          <CommunityButton />
          <CountdownWidget />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-emerald-500/20 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm sm:text-base">HifzTracker</span>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-emerald-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              onTouchStart={preventRefresh}
              onTouchMove={preventRefresh}
              style={{ overscrollBehaviorY: 'contain' }}
              className="bg-slate-900 border-emerald-500/20 text-white p-0 flex flex-col h-full overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-emerald-500/20 shrink-0">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <BookOpen className="h-5 w-5" />
                  <span>HifzTracker</span>
                </div>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                {menuItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    onClick={() => setIsOpen(false)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      pathname === item.href 
                        ? 'bg-emerald-500 text-white' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t border-emerald-500/10 bg-slate-900/80 backdrop-blur-lg">
                <div className="px-6 pt-6">
                   <CommunityButton />
                </div>
                <div className="px-4">
                  <CountdownWidget />
                </div>
                <div className="p-6 pt-0">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}