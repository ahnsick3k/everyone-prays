import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getMessaging } from '@/lib/firebase';

// Cron calls this every minute
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ?force=true → bypass time check, send to all enabled subscriptions
  const force = req.nextUrl.searchParams.get('force') === 'true';

  const now = new Date();
  // Use KST (UTC+9) for Korean time
  const kstHours = (now.getUTCHours() + 9) % 24;
  const kstMinutes = now.getUTCMinutes();
  const currentTime = `${String(kstHours).padStart(2, '0')}:${String(kstMinutes).padStart(2, '0')}`;
  const nowTimestamp = now.getTime();

  let sent = 0;
  let failed = 0;

  // --- 1. Check daily alarms ---
  const subKeys = await redis.smembers('subscription_keys') as string[];

  for (const key of subKeys) {
    const raw = await redis.get<string>(key);
    if (!raw) continue;

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

    if (!data?.alarm?.enabled) continue;
    if (!force && data.alarm.time !== currentTime) continue;

    try {
      await getMessaging().send({
        token: data.fcmToken,
        notification: {
          title: '🙏 기도 시간입니다',
          body: force ? '[테스트] 서버 푸시 확인' : '오늘의 기도를 시작하세요',
        },
        data: {
          url: '/',
          tag: 'prayer-alarm',
        },
        android: {
          priority: 'high',
          notification: {
            icon: 'ic_notification',
            channelId: 'prayer_alarm',
          },
        },
      });
      sent++;
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      // Token invalid/expired — remove from DB
      if (code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token') {
        await redis.del(key);
        await redis.srem('subscription_keys', key);
      }
      failed++;
    }
  }

  // --- 2. Check reservations ---
  const resKeys = await redis.smembers('reservation_keys') as string[];
  let resSent = 0;
  let resCleaned = 0;

  for (const key of resKeys) {
    const raw = await redis.get<string>(key);
    if (!raw) {
      await redis.srem('reservation_keys', key);
      resCleaned++;
      continue;
    }

    const res = typeof raw === 'string' ? JSON.parse(raw) : raw;

    // Clean up old notified reservations (24h past)
    if (res.notified && res.scheduledAt < nowTimestamp - 86400000) {
      await redis.del(key);
      await redis.srem('reservation_keys', key);
      resCleaned++;
      continue;
    }

    if (res.notified) continue;
    if (res.scheduledAt > nowTimestamp) continue;

    // Direct lookup via stored subKey
    const subRaw = await redis.get<string>(res.subKey);
    if (!subRaw) continue;

    const subData = typeof subRaw === 'string' ? JSON.parse(subRaw) : subRaw;
    if (!subData?.fcmToken) continue;

    try {
      await getMessaging().send({
        token: subData.fcmToken,
        notification: {
          title: '📖 예약된 기도 시간',
          body: `${res.name}을(를) 위한 기도 시간입니다`,
        },
        data: {
          url: '/',
          tag: `reservation-${key}`,
        },
        android: {
          priority: 'high',
          notification: {
            icon: 'ic_notification',
            channelId: 'prayer_reservation',
          },
        },
      });
      resSent++;
      sent++;
    } catch {
      failed++;
    }

    // Mark as notified
    await redis.set(key, JSON.stringify({ ...res, notified: true }));
  }

  return NextResponse.json({ currentTime, sent, failed, alarms: subKeys.length, reservations: resKeys.length, resSent, resCleaned });
}
