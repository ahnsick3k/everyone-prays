// Capacitor 네이티브 푸시 알림 (iOS / Android)
// 웹에서는 기존 notification.ts 방식 그대로 사용

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export const isNative = Capacitor.isNativePlatform();

export async function registerPushNotifications(): Promise<string | null> {
  if (!isNative) return null;

  // 권한 요청
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') return null;

  // FCM 등록
  await PushNotifications.register();

  return new Promise((resolve) => {
    PushNotifications.addListener('registration', (token) => {
      console.log('FCM Token:', token.value);
      resolve(token.value);
    });

    PushNotifications.addListener('registrationError', () => {
      resolve(null);
    });
  });
}

export function setupPushListeners() {
  if (!isNative) return;

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received:', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push action:', action);
  });
}
