import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { getWebFcmToken } from '@/lib/firebase-client';

type AlarmPayload = {
  time: string;
  enabled: boolean;
};

const FCM_TOKEN_STORAGE_KEY = 'every1pray-fcm-token';
const DEVICE_ID_STORAGE_KEY = 'every1pray-device-id';
const REGISTRATION_TIMEOUT_MS = 10000;

export const isNative = Capacitor.isNativePlatform();

let pushListenersReady = false;
let registrationListenersReady = false;
let registrationWaiters: Array<(value: string | null) => void> = [];

function getStoredFcmToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
}

function storeFcmToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
}

function getDeviceId(): string | null {
  if (typeof window === 'undefined') return null;

  const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existing) return existing;

  const created =
    window.crypto?.randomUUID?.() ?? `device-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, created);
  return created;
}

export async function registerPushNotifications(): Promise<string | null> {
  if (!isNative) return null;

  let permission = await PushNotifications.checkPermissions();
  if (permission.receive === 'prompt') {
    permission = await PushNotifications.requestPermissions();
  }

  if (permission.receive !== 'granted') return null;

  await setupPushListeners();
  await setupRegistrationListeners();

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.error('[Push] Timed out while waiting for native push registration.');
      registrationWaiters = registrationWaiters.filter((waiter) => waiter !== resolve);
      resolve(null);
    }, REGISTRATION_TIMEOUT_MS);

    registrationWaiters.push(async (value) => {
      clearTimeout(timer);

      if (!value) {
        resolve(null);
        return;
      }

      try {
        const result = await FCM.getToken();
        resolve(result.token || null);
      } catch (error) {
        console.error('[Push] Failed to read native FCM token:', error);
        resolve(null);
      }
    });

    PushNotifications.register().catch((error) => {
      console.error('[Push] Native push register() failed:', error);
      const waiters = registrationWaiters;
      registrationWaiters = [];
      waiters.forEach((waiter) => waiter(null));
    });
  });
}

export async function setupPushListeners() {
  if (!isNative) return;
  if (pushListenersReady) return;
  pushListenersReady = true;

  await PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received:', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push action:', action);
  });
}

async function setupRegistrationListeners() {
  if (registrationListenersReady) return;
  registrationListenersReady = true;

  await PushNotifications.addListener('registration', (token) => {
    const waiters = registrationWaiters;
    registrationWaiters = [];
    waiters.forEach((waiter) => waiter(token.value));
  });

  await PushNotifications.addListener('registrationError', (error) => {
    console.error('[Push] Native push registration failed:', error);
    const waiters = registrationWaiters;
    registrationWaiters = [];
    waiters.forEach((waiter) => waiter(null));
  });
}

export async function getFcmTokenAsync(): Promise<string | null> {
  const fcmToken = isNative
    ? await registerPushNotifications()
    : await getWebFcmToken();

  if (fcmToken) {
    storeFcmToken(fcmToken);
  }

  return fcmToken;
}

async function subscribePushToken(fcmToken: string, alarm: AlarmPayload) {
  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fcmToken,
      oldFcmToken: getStoredFcmToken(),
      alarm,
      deviceId: getDeviceId(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to subscribe push token (${response.status})`);
  }
}

export async function initPushNotifications(alarm: AlarmPayload): Promise<string | null> {
  const fcmToken = await getFcmTokenAsync();
  if (!fcmToken) return null;

  try {
    await subscribePushToken(fcmToken, alarm);
    storeFcmToken(fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('[Push] Failed to save subscription:', error);
    return null;
  }
}

export async function updateAlarmOnServer(alarm: AlarmPayload): Promise<void> {
  const fcmToken = getStoredFcmToken() ?? (await getFcmTokenAsync());
  if (!fcmToken) {
    console.error('[Push] Cannot update alarm without an FCM token.');
    return;
  }

  const response = await fetch('/api/push/alarm', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fcmToken,
      alarm,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update alarm (${response.status})`);
  }
}
