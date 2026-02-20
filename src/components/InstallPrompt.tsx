'use client';

import { useEffect, useState } from 'react';
import { X, Share, PlusSquare } from "lucide-react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isIosDevice = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const isInStandaloneMode = 
      (window.navigator as any).standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches;

    const isDismissed = localStorage.getItem('installPromptDismissed');

    setIsIOS(isIosDevice);
    setIsStandalone(isInStandaloneMode);

    // Show prompt after 2 seconds if on iOS and not already installed/dismissed
    if (isIosDevice && !isInStandaloneMode && !isDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-10 safe-area-bottom">
      <div className="relative bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-700">
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex gap-4 items-center">
          <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
             <img src="/icons/icon-192.png" alt="App Icon" className="h-10 w-10 object-contain rounded-lg" /> 
          </div>
          
          <div className="space-y-0.5">
            <h3 className="font-bold text-white text-xl leading-tight">Install HifzTracker</h3>
            <p className="text-slate-400 text-sm">
              Add to your home screen for a focused, full-screen experience.
            </p>
          </div>
        </div>

        {/* Refined Step-by-Step Instructions */}
        <div className="mt-6 space-y-5 border-t border-white/5 pt-6">
           <div className="flex items-start gap-4 text-sm text-slate-300">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white shrink-0">1</span>
              <p className="leading-relaxed">
                Look for the <Share className="inline h-5 w-5 mx-1 text-blue-400" /> Share icon in your browser menu (usually at the top or bottom of your screen).
              </p>
           </div>
           
           <div className="flex items-start gap-4 text-sm text-slate-300">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white shrink-0">2</span>
              <p className="leading-relaxed">
                Scroll through the options and select <PlusSquare className="inline h-5 w-5 mx-1 text-white" /> Add to Home Screen.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}