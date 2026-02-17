// public/sw.js
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 🚀 CRITICAL: The Bypass Logic for iOS PWA Audio (MAINTAINED)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (
    url.includes('islamic.network') || 
    url.includes('aladhan.com') || 
    url.includes('alquran.cloud') || 
    url.includes('hisnmuslim.com') ||
    url.includes('everyayah.com') // Added this to protect your new reciter source
  ) {
    return; 
  }
});

// 🚀 NEW: Handle Remote Push Notifications (Android & iOS 16.4+)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || "It's time for your daily Hifz session!",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    tag: 'daily-reminder', // Prevents multiple notifications from stacking
    data: {
      url: data.url || '/dashboard'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "HifzTracker", options)
  );
});

// 🚀 NEW: Handle Notification Taps (Essential for iOS)
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification banner
  
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If the app is already open, focus it
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If app is closed, open it to the target URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Listen for the Adhan trigger from the main app (MAINTAINED)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PLAY_ADHAN') {
    self.registration.showNotification('Time for Prayer', {
      body: `It is time for ${event.data.prayerName} in ${event.data.location}.`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'adhan-notification',
      renotify: true,
      data: { url: '/dashboard' } // Added url data for the click handler
    });
  }
});