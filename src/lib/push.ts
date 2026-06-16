'use client';

import { getWebFcmToken } from './firebase-client';

const TOKEN_KEY = 'fcm_token';
const DEVICE_ID_KEY = 'device_id';

function getSavedToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function getDeviceId(): string {
  if (typeof window === 'undefined') return 'unknown';
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

let fcmToken: string | null = null;
let tokenRefreshed = false;

function isNative(): boolean {
  try {
    const { Capacitor } = require('@capacitor/core');
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

async function getNativeToken(): Promise<string | null> {
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') return null;

    await PushNotifications.register();

    return new Promise((resolve) => {
      PushNotifications.addListener('registration', (token) => {
        resolve(token.value);
      });
      PushNotifications.addListener('registrationError', () => {
        resolve(null);
      });
    });
  } catch {
    return null;
  }
}

async function getWebToken(): Promise<string | null> {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  return getWebFcmToken();
}

// Always get fresh token from Firebase and re-register on server
async function refreshToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;

  const token = isNative() ? await getNativeToken() : await getWebFcmToken();
  if (token) {
    const oldToken = getSavedToken();
    fcmToken = token;
    saveToken(token);

    // Register on server — do NOT pass alarm (let server preserve existing)
    console.log('[Push] Registering token on server...');
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fcmToken: token,
        oldFcmToken: oldToken !== token ? oldToken : undefined,
        deviceId: getDeviceId(),
      }),
    }).catch((e) => console.error('[Push] Subscribe failed:', e));
  }
  return fcmToken;
}

// Ensures we have a valid token — refreshes from Firebase once per session
async function ensureToken(): Promise<string | null> {
  // Always refresh once per page load
  if (!tokenRefreshed) {
    tokenRefreshed = true;
    const fresh = await refreshToken();
    if (fresh) return fresh;
  }

  if (fcmToken) return fcmToken;

  // Fallback to saved
  const saved = getSavedToken();
  if (saved) {
    fcmToken = saved;
    return fcmToken;
  }

  return null;
}

export async function initPushNotifications(alarm: { time: string; enabled: boolean }): Promise<string | null> {
  try {
    const token = isNative() ? await getNativeToken() : await getWebToken();

    if (!token) {
      console.error('[Push] Failed to get FCM token');
      return null;
    }

    fcmToken = token;
    saveToken(token);
    tokenRefreshed = true;
    console.log('[Push] FCM Token:', fcmToken.slice(0, 20) + '...');

    // Register on server with alarm and deviceId
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fcmToken, alarm, deviceId: getDeviceId() }),
    });

    if (!res.ok) {
      console.error('[Push] Subscribe API failed:', res.status);
    }

    return fcmToken;
  } catch (error) {
    console.error('[Push] initPushNotifications error:', error);
    return null;
  }
}

export async function updateAlarmOnServer(alarm: { time: string; enabled: boolean }): Promise<void> {
  const token = await ensureToken();
  if (!token) return;

  await fetch('/api/push/alarm', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fcmToken: token, alarm }),
  });
}

export async function getFcmTokenAsync(): Promise<string | null> {
  return ensureToken();
}

export function getFcmToken(): string | null {
  return fcmToken || getSavedToken();
}

export function isNativePlatform(): boolean {
  return isNative();
}
