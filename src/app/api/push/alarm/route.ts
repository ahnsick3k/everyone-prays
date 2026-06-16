import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import crypto from 'crypto';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex').slice(0, 16);
}

export async function PUT(req: NextRequest) {
  try {
    const { fcmToken, alarm } = await req.json();

    if (!fcmToken || !alarm) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const key = `sub:${hashToken(fcmToken)}`;
    const raw = await redis.get<string>(key);

    if (!raw) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    const existing = typeof raw === 'string' ? JSON.parse(raw) : raw;

    await redis.set(key, JSON.stringify({
      ...existing,
      alarm,
      updatedAt: Date.now(),
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alarm update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
