import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import crypto from 'crypto';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex').slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const { fcmToken, alarm } = await req.json();

    if (!fcmToken) {
      return NextResponse.json({ error: 'Invalid FCM token' }, { status: 400 });
    }

    const key = `sub:${hashToken(fcmToken)}`;

    await redis.set(key, JSON.stringify({
      fcmToken,
      alarm: alarm || { time: '06:00', enabled: true },
      updatedAt: Date.now(),
    }));

    await redis.sadd('subscription_keys', key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { fcmToken } = await req.json();
    const key = `sub:${hashToken(fcmToken)}`;

    await redis.del(key);
    await redis.srem('subscription_keys', key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
