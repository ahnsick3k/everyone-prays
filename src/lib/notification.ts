'use client';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function scheduleNotification(title: string, body: string, delay: number) {
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192.png' });
    }
  }, delay);
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
