import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import crypto from 'crypto';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex').slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const { fcmToken, oldFcmToken, alarm, deviceId } = await req.json();

    if (!fcmToken) {
      return NextResponse.json({ error: 'Invalid FCM token' }, { status: 400 });
    }

    const key = `sub:${hashToken(fcmToken)}`;

    // NUCLEAR DEDUP: Remove ALL other subscriptions for this device
    // This ensures exactly 1 subscription per device, period.
    if (deviceId) {
      const allKeys = await redis.smembers('subscription_keys') as string[];
      for (const existingKey of allKeys) {
        if (existingKey === key) continue; // keep the one we're about to write
        const raw = await redis.get<string>(existingKey);
        if (!raw) continue;
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        // Remove if same deviceId OR old token match
        if (data.deviceId === deviceId || (oldFcmToken && data.fcmToken === oldFcmToken)) {
          await redis.del(existingKey);
          await redis.srem('subscription_keys', existingKey);
        }
      }
      await redis.set(`device:${deviceId}`, key);
    }

    // Also clean up old token explicitly
    if (oldFcmToken && oldFcmToken !== fcmToken) {
      const oldKey = `sub:${hashToken(oldFcmToken)}`;
      if (oldKey !== key) {
        await redis.del(oldKey);
        await redis.srem('subscription_keys', oldKey);
      }
    }

    // Preserve existing alarm if not explicitly provided
    let finalAlarm = alarm || { time: '06:00', enabled: true };
    const existing = await redis.get<string>(key);
    if (existing && !alarm) {
      const parsed = typeof existing === 'string' ? JSON.parse(existing) : existing;
      if (parsed?.alarm) finalAlarm = parsed.alarm;
    }

    await redis.set(key, JSON.stringify({
      fcmToken,
      alarm: finalAlarm,
      deviceId: deviceId || undefined,
      updatedAt: Date.now(),
    }));

    await redis.sadd('subscription_keys', key);

    return NextResponse.json({ success: true, key });
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
