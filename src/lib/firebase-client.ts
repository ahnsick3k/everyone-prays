'use client';

import { getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';

const defaultFirebaseConfig = {
  apiKey: 'AIzaSyCTypBj5W8exNDldSc015w3Q43hc69wx3w',
  authDomain: 'every1pray-beac6.firebaseapp.com',
  projectId: 'every1pray-beac6',
  storageBucket: 'every1pray-beac6.firebasestorage.app',
  messagingSenderId: '64392948545',
  appId: '1:64392948545:web:b5be021f61d065be2c0fc0',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    defaultFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};

const defaultVapidKey =
  'BFjfLUtWrKf_LdmPD-PdlXYNCb4D7pAQ5DyIZqtTWMsNJx140tl97gWc5hLf1tcO-IFKetqZ4C8JYHdi9BF1rNc';

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || defaultVapidKey;

let messaging: Messaging | null = null;

function getFirebaseApp() {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

async function getFirebaseMessagingClient(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (messaging) return messaging;

  const supported = await isSupported();
  if (!supported) return null;

  messaging = getMessaging(getFirebaseApp());
  return messaging;
}

export async function getWebFcmToken(): Promise<string | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  if ('Notification' in window && Notification.permission !== 'granted') {
    return null;
  }

  try {
    const firebaseMessaging = await getFirebaseMessagingClient();
    if (!firebaseMessaging) return null;

    const serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
    const token = await getToken(firebaseMessaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    return token || null;
  } catch (error) {
    console.error('[Firebase Web] Failed to get FCM token:', error);
    return null;
  }
}
