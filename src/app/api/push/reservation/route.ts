import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import crypto from 'crypto';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex').slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const { fcmToken, reservation } = await req.json();

    if (!fcmToken || !reservation?.id || !reservation?.scheduledAt) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const key = `reservation:${reservation.id}`;
    const subKey = `sub:${hashToken(fcmToken)}`;

    // Ensure subscription exists (auto-register if not)
    const existingSub = await redis.get(subKey);
    if (!existingSub) {
      await redis.set(subKey, JSON.stringify({
        fcmToken,
        alarm: { time: '06:00', enabled: false },
        updatedAt: Date.now(),
      }));
      await redis.sadd('subscription_keys', subKey);
    }

    await redis.set(key, JSON.stringify({
      subKey,
      name: reservation.name,
      scheduledAt: reservation.scheduledAt,
      notified: false,
    }));

    await redis.sadd('reservation_keys', key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reservation save error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { reservationId } = await req.json();
    const key = `reservation:${reservationId}`;

    await redis.del(key);
    await redis.srem('reservation_keys', key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reservation delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
