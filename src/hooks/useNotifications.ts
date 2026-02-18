'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

export const useNotifications = (userId: string | null) => {
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

  const subscribeUser = async () => {
    try {
      // 1. Get the authenticated user ID directly if the passed one is missing
      let activeUserId = userId;
      if (!activeUserId || activeUserId === 'guest') {
        const { data: { user } } = await supabase.auth.getUser();
        activeUserId = user?.id || null;
      }

      const registration = await navigator.serviceWorker.ready;
      const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC;
      if (!VAPID_PUBLIC_KEY) throw new Error("VAPID Public Key missing in env");

      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      // 2. Create the subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      const subscriptionJson = JSON.stringify(subscription);

      // 3. Save to Supabase ONLY if we have a real user ID
      if (activeUserId && activeUserId !== 'guest') {
        console.log('Updating database for user:', activeUserId);
        const { error } = await supabase
          .from('profiles')
          .update({ push_subscription: subscriptionJson })
          .eq('id', activeUserId);

        if (error) throw error;
        console.log('Database updated successfully!');
      } else {
        console.log('Guest detected, saving to localStorage only');
        localStorage.setItem('push_subscription', subscriptionJson);
      }
      
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