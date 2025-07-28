'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      // Add event listeners to handle any of the generated service worker events
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      wb.addEventListener('activated', (event) => {
        // `event.wasWaitingBeforeActivate` will be false if this is the first time the service worker is being activated
        if (event.wasWaitingBeforeActivate) {
          console.log('Service worker activated after waiting');
          // Show a "refresh" banner or notification
        }
      });

      wb.addEventListener('waiting', () => {
        // Show update available notification
        console.log('Service worker update available');
        
        // You can show a custom update notification here
        const updateAvailable = confirm(
          'A new version of NeoNest is available. Would you like to update?'
        );
        
        if (updateAvailable) {
          wb.messageSkipWaiting();
        }
      });

      wb.register();
    }
  }, []);

  return null;
}
