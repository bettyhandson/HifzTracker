// public/sw.js
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || "Don't forget your daily Hifz today!",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    // 🚀 This tells the OS to use the default notification sound
    silent: false,
    data: {
      url: data.url || '/dashboard'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "HifzTracker", options)
  );
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