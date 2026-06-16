import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getMessaging } from '@/lib/firebase';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subKeys = await redis.smembers('subscription_keys') as string[];
  const results = [];

  for (const key of subKeys) {
    const raw = await redis.get<string>(key);
    if (!raw) continue;
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

    let pushResult = 'skipped';
    if (data?.fcmToken && data.fcmToken !== 'undefined') {
      try {
        await getMessaging().send({
          token: data.fcmToken,
          notification: {
            title: '🔔 테스트 알림',
            body: '알림이 정상적으로 동작합니다!',
          },
        });
        pushResult = 'success';
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        pushResult = `error: ${err.code} ${err.message || ''}`;
      }
    }

    results.push({
      key,
      alarm: data.alarm,
      fcmToken: data.fcmToken?.slice(0, 20) + '...',
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : null,
      pushResult,
    });
  }

  // Also dump reservations
  const resKeys = await redis.smembers('reservation_keys') as string[];
  const reservations = [];
  const now = Date.now();

  for (const key of resKeys) {
    const raw = await redis.get<string>(key);
    if (!raw) continue;
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    reservations.push({
      key,
      ...data,
      scheduledAtStr: new Date(data.scheduledAt).toISOString(),
      isPast: data.scheduledAt <= now,
      subKeyExists: !!(await redis.get(data.subKey)),
    });
  }

  return NextResponse.json({ results, count: results.length, reservations, now, nowStr: new Date(now).toISOString() });
}

// DELETE: Clean all subscriptions and reservations
export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subKeys = await redis.smembers('subscription_keys') as string[];
  for (const key of subKeys) {
    await redis.del(key);
    await redis.srem('subscription_keys', key);
  }

  const resKeys = await redis.smembers('reservation_keys') as string[];
  for (const key of resKeys) {
    await redis.del(key);
    await redis.srem('reservation_keys', key);
  }

  return NextResponse.json({ cleaned: { subscriptions: subKeys.length, reservations: resKeys.length } });
}
