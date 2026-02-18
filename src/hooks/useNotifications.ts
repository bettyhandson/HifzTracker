'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// 🚀 Helper to convert VAPID string to the format the browser requires
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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
      // Ensure sw.js is in your /public folder
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (err) {
      console.error('SW Registration failed:', err);
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // 🚀 IMPORTANT: Convert the public VAPID key from your .env
      const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC;
      if (!VAPID_PUBLIC_KEY) throw new Error("VAPID Public Key missing in env");

      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      // Save to Supabase
      if (userId && userId !== 'guest') {
        const { error } = await supabase
          .from('profiles')
          .update({ push_subscription: JSON.stringify(subscription) })
          .eq('id', userId);

        if (error) throw error;
      } else {
        localStorage.setItem('push_subscription', JSON.stringify(subscription));
      }
      
      console.log('Successfully subscribed to Hifz reminders');
    } catch (error) {
      console.error('Failed to subscribe user to push:', error);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        await subscribeUser();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  return { requestPermission, isSupported, permissionStatus };
};