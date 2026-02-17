// public/sw.js
self.addEventListener('install', () => {
  self.skipWaiting();
});

// 🚀 COMBINED & UPDATED: Handle Remote Push Notifications (Android & iOS 16.4+)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || "It's time for your daily Hifz session!",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    tag: 'daily-reminder', // Prevents multiple notifications from stacking
    renotify: true, // 🚀 Makes the phone alert even if a previous notification exists
    silent: false, // 🚀 Ensures the OS uses the default notification sound
    data: {
      url: data.url || '/dashboard/recite' // 🚀 Default to recite page for better conversion
    },
    // 🚀 NEW: Action Buttons for quick access from lock screen
    actions: [
      { action: 'recite', title: 'Start Reciting' },
      { action: 'close', title: 'Later' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "HifzTracker", options)
  );
});

// 🚀 MAINTAINED: Handle Notification Taps (Essential for iOS)
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification banner
  
  // 🚀 Logic for Action Buttons
  if (event.action === 'close') return;

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

// 🚀 MAINTAINED: Listen for the Adhan trigger from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PLAY_ADHAN') {
    self.registration.showNotification('Time for Prayer', {
      body: `It is time for ${event.data.prayerName} in ${event.data.location}.`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'adhan-notification',
      renotify: true,
      data: { url: '/dashboard' } 
    });
  }
});