'use client';

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 🚀 Only initialize the SDK here
    OneSignal.init({
      appId: "8b2fba2d-3c3a-4b7b-9938-29f1492b5b96", // Get this from OneSignal Dashboard
      allowLocalhostAsSecureOrigin: true,
      notifybutton: {
        enable: true, // Shows a small bell icon for users to subscribe
      },
    });
  }, []);

  return <>{children}</>;
}