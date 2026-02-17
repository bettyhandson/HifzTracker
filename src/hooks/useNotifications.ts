'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // 🚀 Ensure your supabase client is imported

export const useNotifications = (userId: string) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      if ('Notification' in window) {
        setPermissionStatus(Notification.permission);
      }
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

  // 🚀 NEW: Function to save the push address to your database
  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID keys identify your server to the browser's push service
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC
      });

      if (userId && userId !== 'guest') {
        const { error } = await supabase
          .from('profiles')
          .update({ push_subscription: JSON.stringify(subscription) })
          .eq('id', userId);

        if (error) throw error;
      } else {
        // For guests, save locally so we can still trigger local reminders
        localStorage.setItem('push_subscription', JSON.stringify(subscription));
      }
    } catch (error) {
      console.error('Failed to subscribe user to push:', error);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support notifications");
      return;
    }

    if (Notification.permission === 'denied') {
      alert("Notifications are blocked. Please allow them in your browser settings to receive daily reminders.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        await subscribeUser(); // 🚀 Automatically subscribe once granted
        alert("Alhamdulillah! Daily reminders are now active.");
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  return { requestPermission, isSupported, permissionStatus };
};