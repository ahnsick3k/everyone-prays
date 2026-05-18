import Dexie, { type EntityTable } from 'dexie';

export interface Prayer {
  id: string;
  name: string;
  content: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface Alarm {
  id: string;
  time: string; // HH:mm
  enabled: boolean;
  repeat: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  content: string;
  scheduledAt: number;
  notified: boolean;
  createdAt: number;
}

const db = new Dexie('EveryonePraysDB') as Dexie & {
  prayers: EntityTable<Prayer, 'id'>;
  alarms: EntityTable<Alarm, 'id'>;
  reservations: EntityTable<Reservation, 'id'>;
};

db.version(1).stores({
  prayers: 'id, name, date, createdAt',
  alarms: 'id',
  reservations: 'id, scheduledAt, notified, createdAt',
});

export { db };
