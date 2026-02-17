import { useEffect, useState } from 'react';

export const useNotifications = (userId: string) => {
  const [isSupported, setIsSupported] = useState(false);
  // 🚀 Track the permission status
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (err) {
      console.error('SW Registration failed:', err);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    // 🚀 Handle "Denied" state specifically for iOS/Android
    if (Notification.permission === 'denied') {
      alert("Notifications are blocked. Please go to your iPhone Settings > HifzTracker > Notifications and tap 'Allow'.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission); // Update state to trigger UI changes
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        console.log('Notification permission granted & SW Ready');
        alert("Alhamdulillah! Reminders enabled successfully!");
      } else {
        alert("Notifications were denied. You may need to enable them in your browser settings.");
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  return { requestPermission, isSupported, permissionStatus };
};