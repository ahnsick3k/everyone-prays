'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);

          // Request notification permission
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }

          // Tell SW to start alarm checking
          registration.active?.postMessage('START_ALARM');
          navigator.serviceWorker.ready.then((reg) => {
            reg.active?.postMessage('START_ALARM');
          });
        })
        .catch((err) => console.error('SW registration failed:', err));
    }
  }, []);

  return null;
}
