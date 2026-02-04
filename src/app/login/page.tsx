'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudSync, Loader2, MailCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 🚀 The Sync Engine Logic
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Gather Guest Data from iPhone Memory
    const localProfile = JSON.parse(localStorage.getItem('hifz_tracker_data') || '{}');
    const localLogs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');

    // 2. Register User with Metadata for your SQL Trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          // 🚀 Pass guest stats so they are available immediately in the profile
          current_streak: localProfile.streak || 1,
          preferred_reciter: localProfile.preferred_reciter || 'ar.alafasy',
          daily_goal_ayahs: localProfile.daily_goal_ayahs || 10
        }
      },
    });
    
    if (authError) {
      setMessage({ type: 'error', text: authError.message });
      setLoading(false);
      return;
    }

    // 🚀 3. Background Sync: Only if user is created successfully
    if (authData.user && localLogs.length > 0) {
      const logsToSync = localLogs.map((log: any) => ({
        user_id: authData.user?.id,
        surah_number: log.surah_number,
        ayah_start: log.ayah_start,
        ayah_end: log.ayah_end,
        created_at: log.created_at
      }));

      // Push history to Supabase
      await supabase.from('progress_logs').insert(logsToSync);
      
      // Clear local memory now that data is safe in the cloud
      localStorage.removeItem('hifz_progress_logs');
      localStorage.removeItem('hifz_tracker_data');
    }

    setMessage({ 
      type: 'success', 
      text: 'You’re all set! Just check your email (inbox or spam) to verify your account and sync your data.' 
    });
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#020617] text-white font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="text-center space-y-2 relative z-10">
          <h1 className="text-4xl font-black text-emerald-500 tracking-tighter">HifzTracker<span className="text-white">.</span></h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Secure Your Journey to Eternity</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full relative z-10">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 p-1 rounded-2xl h-14 border border-white/5">
            <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-emerald-500 text-white placeholder:text-slate-600" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <Input 
                type="password" 
                placeholder="Password" 
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-emerald-500 text-white placeholder:text-slate-600" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-900/20" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input 
                type="text" 
                placeholder="Full Name" 
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-emerald-500 text-white placeholder:text-slate-600" 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-emerald-500 text-white placeholder:text-slate-600" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <Input 
                type="password" 
                placeholder="Create Password" 
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-emerald-500 text-white placeholder:text-slate-600" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <Button className="w-full bg-emerald-500 hover:bg-emerald-400 h-14 rounded-2xl font-black text-slate-950 flex gap-2 items-center" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <CloudSync className="h-5 w-5" /> Sync & Register
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {message.type === 'success' ? <MailCheck className="h-5 w-5" /> : null}
            <p className="flex-1">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}