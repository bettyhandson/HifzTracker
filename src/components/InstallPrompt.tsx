'use client';

import { useEffect, useState } from 'react';
import { X, Share, PlusSquare } from "lucide-react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. More robust iOS Detection
    const isIosDevice = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // 2. Stronger Standalone Check
    const isInStandaloneMode = 
      (window.navigator as any).standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches;

    // 3. Persistence Check
    const isDismissed = localStorage.getItem('installPromptDismissed');

    setIsIOS(isIosDevice);
    setIsStandalone(isInStandaloneMode);

    if (isIosDevice && !isInStandaloneMode && !isDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Function to trigger the native iOS Share Sheet
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HifzTracker',
          text: 'Install HifzTracker to your home screen for the best experience.',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled the share or error occurred
        console.log('Error or cancellation:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert("Please use the Share button in your browser's toolbar below.");
    }
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
            <h3 className="font-bold text-white text-xl">Install HifzTracker</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              For a faster, focused, and full-screen experience.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 space-y-4 border-t border-white/5 pt-5">
           <div className="flex items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">1</span>
              <div className="flex flex-wrap items-center">
                <span>Tap the</span>
                <button 
                  onClick={handleShareClick}
                  className="mx-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center gap-2 transition-all border border-blue-500/40 active:scale-95"
                >
                  <Share className="h-4 w-4 text-blue-400" /> 
                  <span className="text-blue-400 font-semibold">Share</span>
                </button> 
                <span>button.</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">2</span>
              <span>Scroll down and select <PlusSquare className="inline h-4 w-4 mx-1 text-white" /> <span className="font-bold text-white">Add to Home Screen</span>.</span>
           </div>
        </div>
      </div>
    </div>
  );
}