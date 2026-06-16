'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCTypBj5W8exNDldSc015w3Q43hc69wx3w",
  authDomain: "every1pray-beac6.firebaseapp.com",
  projectId: "every1pray-beac6",
  storageBucket: "every1pray-beac6.firebasestorage.app",
  messagingSenderId: "64392948545",
  appId: "1:64392948545:web:b5be021f61d065be2c0fc0",
};

const VAPID_KEY = 'BFjfLUtWrKf_LdmPD-PdlXYNCb4D7pAQ5DyIZqtTWMsNJx140tl97gWc5hLf1tcO-IFKetqZ4C8JYHdi9BF1rNc';

let messaging: Messaging | null = null;

function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;
  if (messaging) return messaging;

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  messaging = getMessaging(app);
  return messaging;
}

export async function getWebFcmToken(): Promise<string | null> {
  try {
    const supported = await isSupported();
    if (!supported) return null;

    const m = getFirebaseMessaging();
    if (!m) return null;

    // Registers the service worker and gets FCM token
    const token = await getToken(m, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js'),
    });

    return token || null;
  } catch (error) {
    console.error('[Firebase Web] getToken error:', error);
    return null;
  }
}
