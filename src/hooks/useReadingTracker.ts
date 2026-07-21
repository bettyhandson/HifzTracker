import { useState, useRef, useEffect, useCallback } from 'react';

interface LogSessionParams {
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
}
export function useReadingTracker() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sessionStartTime = useRef<number>(Date.now());
  const accumulatedTime = useRef<number>(0);
  const isTabActive = useRef<boolean>(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabActive.current = false;
        const timeSpentSoFar = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        accumulatedTime.current += timeSpentSoFar;
        console.log("Tab inactive. Accumulated time:", accumulatedTime.current);
      } else {
        isTabActive.current = true;
        sessionStartTime.current = Date.now();
        console.log("Tab active. Timer resumed.");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const resetTimer = useCallback(() => {
    console.log("Timer reset.");
    sessionStartTime.current = Date.now();
    accumulatedTime.current = 0;
  }, []);

  const logReadingSession = async ({ surahNumber, ayahStart, ayahEnd }: LogSessionParams) => {
    if (isSubmitting) return;

    let finalSecondsSpent = accumulatedTime.current;
    if (isTabActive.current) {
      finalSecondsSpent += Math.floor((Date.now() - sessionStartTime.current) / 1000);
    }

    // DEBUG: Print the final calculation before sending to API
    console.log(`LOGGING SESSION: ${finalSecondsSpent} seconds for Surah ${surahNumber}, Ayah ${ayahStart}-${ayahEnd}`);

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/track-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surah_number: surahNumber,
          ayah_start: ayahStart,
          ayah_end: ayahEnd,
          seconds_spent: finalSecondsSpent,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(`Success! Earned ${data.points_awarded} points.`);
        return data.points_awarded;
      } else {
        console.error('API Error:', data.error);
        return 0;
      }
    } catch (error) {
      console.error('Network Error:', error);
      return 0;
    } finally {
      setIsSubmitting(false);
      resetTimer();
    }
  };
// Add this new function to the return object of useReadingTracker
const getSessionTime = useCallback(() => {
  const currentTime = Date.now();
    const activeSessionTime = isTabActive.current 
      ? Math.floor((currentTime - sessionStartTime.current) / 1000) 
      : 0;
  let time = accumulatedTime.current;
  if (isTabActive.current) {
    time += Math.floor((Date.now() - sessionStartTime.current) / 1000);
  }
  return time;
}, []);

// Update the return statement
return { logReadingSession, resetTimer, isSubmitting, getSessionTime };
}
