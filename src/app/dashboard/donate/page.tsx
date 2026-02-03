'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Coffee, Heart, Server, ShieldCheck, Target, Loader2 } from "lucide-react";
import PaystackPop from '@paystack/inline-js';
import DashboardShell from "@/components/dashboard/DashboardShell";
import { redirect } from "next/navigation";

export default function Donate({ userId }: { userId?: string }) {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [currentRaised, setCurrentRaised] = useState<number>(0);
  const [fetching, setFetching] = useState(true);


  const monthlyGoal = 50000;

  // 1. Fetch live donation total
  useEffect(() => {
    const fetchTotal = async () => {
      const { data, error } = await supabase.rpc('get_monthly_donations');
      if (!error) setCurrentRaised(Number(data));
      setFetching(false);
    };
    fetchTotal();
  }, []);

  const progressPercentage = Math.min((currentRaised / monthlyGoal) * 100, 100);

  const handlePaystack = (amount: number) => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount t continue.");
      return;
    }

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '', // Ensure key is string
      email: 'support@optimistcx.space',
      amount: amount * 100,
      currency: 'NGN',
      onSuccess: async (transaction: any) => {
        // Log successful donation to Supabase using the 'transaction' object
        const { error } = await supabase.from('donations').insert([{
          amount: amount,
          reference: transaction.reference, // Fixed: use transaction.reference
          user_id: userId || null
        }]);

        if (!error) {
          setCurrentRaised(prev => prev + amount);
          alert('Jazakumullahu Khayran! Your donation has been recorded.');
        } else {
          console.error("Supabase Error:", error.message);
        }
      },
      onCancel: () => console.log('Window closed') // Library uses onCancel, not onClose
    });
  };

  return (
    <DashboardShell>
      <section id="donate" className="py-12 sm:py-16 md:py-24 bg-slate-900 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Support the Mission of <br />
              <span className="text-emerald-400">Continuous Charity</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-emerald-100/80">
              HifzTracker is a Sadaqah Jariyah project. We don't show ads or sell your data. 
              Your donations help us cover server costs, database maintenance, and future 
              features for thousands of Muslims worldwide.
            </p>
            
            <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-sm sm:text-base text-emerald-100/90">
              <li className="flex gap-x-3 items-start sm:items-center">
                <Server className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>100% of funds go to infrastructure and development.</span>
              </li>
              <li className="flex gap-x-3 items-start sm:items-center">
                <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>Keep the platform free for those who cannot afford it.</span>
              </li>
              <li className="flex gap-x-3 items-start sm:items-center">
                <Heart className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>Earn a share in the reward for every Ayah tracked.</span>
              </li>
            </ul>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 opacity-20 blur" />
            <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-slate-900">
              
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-slate-50/50 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-end mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Monthly Server Goal</span>
                  </div>
                  {fetching ? <Loader2 className="h-3 w-3 animate-spin" /> : (
                    <span className="text-xs font-bold text-emerald-600">{Math.round(progressPercentage)}%</span>
                  )}
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase gap-2">
                  <span className="truncate">Raised: ₦{currentRaised.toLocaleString()}</span>
                  <span className="truncate">Goal: ₦{monthlyGoal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="p-3 bg-emerald-50 rounded-full flex-shrink-0">
                  <Coffee className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl">Buy the Dev a Coffee</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Support server maintenance</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => handlePaystack(1500)} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 sm:py-6 text-base sm:text-lg font-semibold"
                >
                  Donate ₦1,500
                </Button>
                
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                    <input 
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 sm:py-3 rounded-md border border-emerald-100 bg-emerald-50/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-base"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handlePaystack(Number(customAmount))}
                    className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 py-5 sm:py-6 font-bold text-base sm:text-lg"
                  >
                    Pay Custom Amount
                  </Button>
                </div>
              </div>
              
              <p className="mt-6 text-center text-xs text-slate-400">
                Secure payment via Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </DashboardShell>
  );
}