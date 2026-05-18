'use client';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function notifyServiceWorker(message: string) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.active?.postMessage(message);
    });
  }
}

export function getNextAlarmDelay(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}
