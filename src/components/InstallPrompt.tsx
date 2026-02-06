'use client';

import { useEffect, useState } from 'react';
import { X, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
 
  useEffect(() => {
  // 1. More robust iOS Detection
  const isIosDevice = 
    /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // For newer iPads

  // 2. Stronger Standalone Check
  const isInStandaloneMode = 
    (window.navigator as any).standalone === true || 
    window.matchMedia('(display-mode: standalone)').matches;

  // 3. Persistence Check (Don't show if they already dismissed it today)
  const isDismissed = localStorage.getItem('installPromptDismissed');

  setIsIOS(isIosDevice);
  setIsStandalone(isInStandaloneMode);

  if (isIosDevice && !isInStandaloneMode && !isDismissed) {
    const timer = setTimeout(() => setShowPrompt(true), 3000);
    return () => clearTimeout(timer);
  }
}, []);

// 4. Update the close function to remember dismissal
const handleClose = () => {
  setShowPrompt(false);
  localStorage.setItem('installPromptDismissed', 'true');
};

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 safe-area-bottom">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => setShowPrompt(false)} 
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex gap-4 items-start">
          <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
             <img src="/icons/icon-192.png" alt="App Icon" className="h-8 w-8 object-contain" /> 
             {/* Make sure you have an icon, otherwise use text */}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg">Install HifzTracker</h3>
            <p className="text-slate-400 text-sm">
              Add to Home Screen for better screen experience and a focused reading.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
           <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-xs font-bold">1</span>
              <span>Tap the <Share className="inline h-4 w-4 mx-1 text-blue-400" /> Share button below.</span>
           </div>
           <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-xs font-bold">2</span>
              <span>Select <PlusSquare className="inline h-4 w-4 mx-1 text-white" /> <span className="font-bold text-white">Add to Home Screen</span>.</span>
           </div>
        </div>
      </div>
    </div>
  );
}