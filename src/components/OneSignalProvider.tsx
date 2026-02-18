'use client';

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: "8b2fba2d-3c3a-4b7b-9938-29f1492b5b96",
          allowLocalhostAsSecureOrigin: true,
          notifyBell: {
            enable: true,
            position: 'bottom-right',
            size: 'medium',
          },
        });
        console.log("OneSignal Initialized Successfully");
      } catch (error) {
        console.error("OneSignal Init Error:", error);
      }
    };

    initOneSignal();
  }, []);

  return <>{children}</>;
}