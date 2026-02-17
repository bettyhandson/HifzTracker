import { useEffect, useState } from 'react';

export const useNotifications = (userId: string) => {
  const [isSupported, setIsSupported] = useState(false);
  
  // 🚀 FIX: Start with 'default' and update in useEffect to prevent SSR errors
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      // 🚀 Check actual browser permission only once we are on the client
      if ('Notification' in window) {
        setPermissionStatus(Notification.permission);
      }
      
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      // Use the registration to ensure it's active
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

    if (Notification.permission === 'denied') {
      alert("Notifications are blocked. Please go to your browser/phone settings for this site and tap 'Allow'.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        await navigator.serviceWorker.ready;
        alert("Alhamdulillah! Reminders enabled successfully!");
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  return { requestPermission, isSupported, permissionStatus };
};