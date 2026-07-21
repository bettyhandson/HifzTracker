'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Ticket, Trophy, Coins, Sparkles, AlertCircle, ChevronLeft, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

export default function RewardsDashboard() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(0);
  const [activeRaffle, setActiveRaffle] = useState<any | null>(null);
  const [userTickets, setUserTickets] = useState<number>(0);
  const [isWinner, setIsWinner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const TICKET_COST = 500;

  const fetchDashboardData = useCallback(async () => {
    if (!currentUserId) return;
    
    try {
      // 1. Fetch Profile
      const { data: profile } = await supabase.from('profiles').select('points_balance').eq('id', currentUserId).single();
      if (profile) setPointsBalance(profile.points_balance);

      // 2. Fetch Active Raffle
      const { data: raffle } = await supabase
        .from('raffle_draws')
        .select('*')
        .eq('is_completed', false)
        .order('draw_date', { ascending: false })
        .limit(1)
        .single();
      
      if (raffle) {
        setActiveRaffle(raffle);
        const { count } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUserId)
          .eq('raffle_draw_id', raffle.id);
        setUserTickets(count || 0);
      }

      // 3. Fetch Winner Status
      const { data: winnerData } = await supabase
        .from('raffle_winners')
        .select('*')
        .eq('user_id', currentUserId)
        .in('status', ['approved', 'requested', 'paid'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      setIsWinner(winnerData || null);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (currentUserId) fetchDashboardData();
    else setLoading(false);
  }, [currentUserId, fetchDashboardData]);

  const handleBuyTicket = async () => {
    if (pointsBalance < TICKET_COST) {
      toast.error("Not enough points!");
      return;
    }
    if (!activeRaffle || !currentUserId) return;

    setBuying(true);
    try {
      const { error: rpcError } = await supabase.rpc('buy_raffle_ticket', { p_raffle_id: activeRaffle.id });
      if (rpcError) throw rpcError;
      
      await fetchDashboardData();
      toast.success("🎟️ Ticket purchased successfully!");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div></div>;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col z-0">
      <div className="flex-none p-4 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl z-50 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="text-emerald-500 bg-emerald-500/10 rounded-xl h-10 w-10 border border-emerald-500/20"><ChevronLeft className="h-5 w-5" /></Button>
        <span className="text-sm font-bold text-white bg-white/5 px-4 py-2 rounded-full border border-white/10">Rewards & Raffle</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6 pb-32">
          
          {/* Winner Claim Logic */}
          {isWinner?.status === 'approved' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] p-8 text-center backdrop-blur-md shadow-2xl">
              <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">Congratulations, Winner!</h2>
              <p className="text-emerald-100/80 mb-6 max-w-md mx-auto">Please enter your phone number to receive your prize airtime.</p>
              <div className="max-w-sm mx-auto space-y-4">
                <input id="phone-input" type="tel" placeholder="080XXXXXXXX" className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white text-center" />
                <Button onClick={async () => {
                  const phone = (document.getElementById('phone-input') as HTMLInputElement).value;
                  if (!phone || phone.length < 10) return toast.error("Enter valid phone number");
                  
                  // Optimistic UI update
                  setIsWinner({ ...isWinner, status: 'requested' });
                  
                  const { error: updateError } = await supabase.from('raffle_winners').update({ status: 'requested' }).eq('id', isWinner.id);
                  if (updateError) {
                    toast.error("Failed to update status: " + updateError.message);
                    return;
                  }
                  
                  await supabase.from('profiles').update({ phone_number: phone }).eq('id', currentUserId);
                  toast.success("Request submitted successfully!");
                  fetchDashboardData();
                }} className="w-full bg-emerald-500 text-black font-bold h-14 rounded-xl">Claim My Prize</Button>
              </div>
            </div>
          )}

          {isWinner?.status === 'requested' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-[2rem] p-6 text-center">
              <AlertCircle className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white">Prize Claim Requested</h2>
              <p className="text-blue-100/70 text-sm">Our team is processing your airtime credit.</p>
            </div>
          )}

          {isWinner?.status === 'paid' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] p-6 text-center">
              <Trophy className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white">Prize Paid Out!</h2>
              <p className="text-emerald-100/70 text-sm">Your airtime reward has been successfully sent. Check back for the next draw!</p>
            </div>
          )}

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-900/40 to-[#0a0a0a] border border-emerald-500/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-6">
              <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-emerald-400" /> Rewards Hub</h1>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md flex items-center gap-4">
                <Coins className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Your Balance</p>
                  <p className="text-2xl font-black">{pointsBalance} pts</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
              <span className="text-emerald-400 text-xs font-bold uppercase">Active This Week</span>
              {activeRaffle ? (
                <>
                  <h2 className="text-2xl font-bold mt-2 mb-6">{activeRaffle.prize_description}</h2>
                  <Button onClick={handleBuyTicket} disabled={buying || pointsBalance < TICKET_COST} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-14 w-full rounded-xl">
                    {buying ? 'Processing...' : `Buy Ticket • ${TICKET_COST} pts`}
                  </Button>
                </>
              ) : <p className="text-slate-400 py-6">No active raffles.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}