'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Trophy, CheckCircle, Phone, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const ADMIN_UUID = "38e84654-96cf-4f82-97b4-c82669fd1741"; 

export default function AdminRafflePage() {
  const router = useRouter();
  const [winners, setWinners] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== ADMIN_UUID) {
        router.replace('/dashboard');
        return;
      }
      fetchRecentWinners();
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const fetchRecentWinners = async () => {
    const { data } = await supabase
      .from('raffle_winners')
      .select('id, status, created_at, profiles(phone_number, full_name)')
      .in('status', ['pending', 'approved', 'requested', 'paid']) 
      .order('created_at', { ascending: false });
    if (data) setWinners(data);
  };

  const handleApproveWinner = async (id: string) => {
    const { error } = await supabase.from('raffle_winners').update({ status: 'approved' }).eq('id', id);
    if (error) toast.error("Error: " + error.message);
    else { toast.success("Winner approved!"); fetchRecentWinners(); }
  };

  const handleMarkPaid = async (id: string) => {
    const { error } = await supabase.from('raffle_winners').update({ status: 'paid' }).eq('id', id);
    if (error) toast.error("Error: " + error.message);
    else { toast.success("Marked as paid!"); fetchRecentWinners(); }
  };

  if (loading) return <div className="p-10 text-white text-center">Verifying Admin Access...</div>;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white overflow-y-auto">
      <div className="p-4 flex items-center gap-4 border-b border-white/10">
        <Button variant="ghost" onClick={() => router.push('/dashboard')}><ChevronLeft /></Button>
        <h1 className="text-xl font-bold">Admin Draw Engine</h1>
        <Button onClick={async () => { setIsDrawing(true); await supabase.rpc('draw_raffle_winners'); setIsDrawing(false); fetchRecentWinners(); }} disabled={isDrawing} className="ml-auto bg-amber-500 text-black">
          {isDrawing ? <Loader2 className="animate-spin" /> : "Execute Weekly Draw"}
        </Button>
      </div>
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        {winners.map((w) => (
          <div key={w.id} className="p-6 bg-white/5 rounded-2xl flex justify-between items-center border border-white/10">
            <div>
              <p className="font-bold text-lg">{w.profiles?.full_name || 'Anonymous'}</p>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <Phone className="w-4 h-4" /> {w.profiles?.phone_number || 'No phone provided'}
              </p>
              <p className="text-xs mt-1 text-slate-500 uppercase tracking-widest font-bold">Status: {w.status}</p>
            </div>
            
            {w.status === 'pending' && (
              <Button onClick={() => handleApproveWinner(w.id)} className="bg-blue-600">Approve Winner</Button>
            )}
            {w.status === 'approved' && (
              <span className="text-blue-400 font-bold italic">Waiting for claim...</span>
            )}
            {w.status === 'requested' && (
              <Button onClick={() => handleMarkPaid(w.id)} className="bg-emerald-600">Mark as Paid</Button>
            )}
            {w.status === 'paid' && (
              <span className="text-emerald-500 font-bold flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Paid</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}