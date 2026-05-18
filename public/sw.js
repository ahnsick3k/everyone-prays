const CACHE_NAME = 'everyone-prays-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Alarm check interval
let checkInterval = null;

function startChecking() {
  if (checkInterval) return;
  checkAlarms();
  checkReservations();
  checkInterval = setInterval(() => {
    checkAlarms();
    checkReservations();
  }, 60000);
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('EveryonePraysDB', 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('prayers')) {
        const ps = db.createObjectStore('prayers', { keyPath: 'id' });
        ps.createIndex('name', 'name');
        ps.createIndex('date', 'date');
        ps.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('alarms')) {
        db.createObjectStore('alarms', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('reservations')) {
        const rs = db.createObjectStore('reservations', { keyPath: 'id' });
        rs.createIndex('scheduledAt', 'scheduledAt');
        rs.createIndex('notified', 'notified');
        rs.createIndex('createdAt', 'createdAt');
      }
    };
  });
}

async function checkAlarms() {
  try {
    const db = await openDB();
    const tx = db.transaction('alarms', 'readonly');
    const store = tx.objectStore('alarms');
    const req = store.getAll();
    req.onsuccess = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      req.result.forEach((alarm) => {
        if (alarm.enabled && alarm.time === currentTime) {
          self.registration.showNotification('🙏 기도 시간입니다', {
            body: '오늘의 기도를 시작하세요',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'prayer-alarm',
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200],
            actions: [{ action: 'open', title: '기도하기' }],
          });
        }
      });
    };
  } catch (e) {}
}

async function checkReservations() {
  try {
    const db = await openDB();
    const tx = db.transaction('reservations', 'readwrite');
    const store = tx.objectStore('reservations');
    const req = store.getAll();
    req.onsuccess = () => {
      const now = Date.now();
      req.result.forEach((res) => {
        if (!res.notified && res.scheduledAt <= now) {
          self.registration.showNotification('📖 예약된 기도 시간', {
            body: `${res.name}을(를) 위한 기도 시간입니다`,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: `reservation-${res.id}`,
            requireInteraction: true,
            vibrate: [200, 100, 200],
          });
          res.notified = true;
          const utx = db.transaction('reservations', 'readwrite');
          utx.objectStore('reservations').put(res);
        }
      });
    };
  } catch (e) {}
}

self.addEventListener('message', (event) => {
  if (event.data === 'START_ALARM') startChecking();
  if (event.data === 'CHECK_NOW') { checkAlarms(); checkReservations(); }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow('/');
    })
  );
});
