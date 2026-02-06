'use client'

import { usePullToRefresh } from 'use-pull-to-refresh'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function RefreshHandler() {
  const router = useRouter();

  // 🚀 Changed "pullProgress" to "pullPosition"
  const { isRefreshing, pullPosition } = usePullToRefresh({
    onRefresh: () => {
      router.refresh();
      window.location.reload();
    },
    refreshThreshold: 90, 
  });

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-full flex justify-center pointer-events-none z-[100] transition-opacity duration-200"
        style={{ 
          // 🚀 Use "pullPosition" here as well
          opacity: pullPosition > 0 || isRefreshing ? 1 : 0,
          transform: `translateY(${Math.min(pullPosition, 100)}px)`
        }}
      >
        <div className="bg-slate-900/80 backdrop-blur-md p-2 rounded-full border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
          <Loader2 
            className={`w-6 h-6 text-emerald-500 ${isRefreshing ? 'animate-spin' : ''}`} 
            style={{ transform: `rotate(${pullPosition * 2}deg)` }} 
          />
        </div>
      </div>
    </>
  );
}