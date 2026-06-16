import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getMessaging } from '@/lib/firebase';

const MAX_RETRY = 5;
const RETRY_WINDOW_MS = 30 * 60 * 1000; // 30분 내 재시도

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
  let skippedDup = 0;

  // --- 1. Check daily alarms ---
  const subKeys = await redis.smembers('subscription_keys') as string[];

  for (const key of subKeys) {
    const raw = await redis.get<string>(key);
    if (!raw) continue;

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

    if (!data?.alarm?.enabled) continue;
    if (!data?.fcmToken || data.fcmToken === 'undefined') continue;
    if (!force && data.alarm.time !== currentTime) continue;

    // Idempotency: skip if already sent this minute
    const sentKey = `sent:${key}:${currentTime}`;
    const alreadySent = await redis.get(sentKey);
    if (alreadySent && !force) {
      skippedDup++;
      continue;
    }

    try {
      await getMessaging().send({
        token: data.fcmToken,
        data: {
          title: '🙏 Every 1 Pray',
          body: force ? '알림이 정상적으로 동작합니다!' : '기도 시간입니다!',
          url: '/',
          tag: 'prayer-alarm',
        },
        android: {
          priority: 'high',
        },
        webpush: {
          headers: { Urgency: 'high' },
        },
      });
      sent++;
      // Mark as sent for this minute (expire after 90 seconds)
      await redis.set(sentKey, '1', { ex: 90 });
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

  // --- 2. Check reservations (with retry) ---
  const resKeys = await redis.smembers('reservation_keys') as string[];
  let resSent = 0;
  let resCleaned = 0;
  let retried = 0;

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

    // Give up after MAX_RETRY or RETRY_WINDOW
    const attempts = res.retryCount || 0;
    if (attempts >= MAX_RETRY || (nowTimestamp - res.scheduledAt > RETRY_WINDOW_MS)) {
      await redis.set(key, JSON.stringify({ ...res, notified: true, failed: true }));
      resCleaned++;
      continue;
    }

    // Direct lookup via stored subKey
    const subRaw = await redis.get<string>(res.subKey);
    if (!subRaw) {
      // subKey doesn't exist — increment retry, wait for user to re-register
      await redis.set(key, JSON.stringify({ ...res, retryCount: attempts + 1 }));
      retried++;
      continue;
    }

    const subData = typeof subRaw === 'string' ? JSON.parse(subRaw) : subRaw;
    if (!subData?.fcmToken || subData.fcmToken === 'undefined') {
      await redis.set(key, JSON.stringify({ ...res, retryCount: attempts + 1 }));
      retried++;
      continue;
    }

    try {
      await getMessaging().send({
        token: subData.fcmToken,
        data: {
          title: '🙏 Every 1 Pray',
          body: `예약된 ${res.name}을(를) 위한 기도 시간입니다!`,
          url: '/',
          tag: `reservation-${key}`,
        },
        android: {
          priority: 'high',
        },
        webpush: {
          headers: { Urgency: 'high' },
        },
      });
      resSent++;
      sent++;
      // Mark as notified only on success
      await redis.set(key, JSON.stringify({ ...res, notified: true }));
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      // Token expired — remove subscription, retry next time with new token
      if (code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token') {
        await redis.del(res.subKey);
        await redis.srem('subscription_keys', res.subKey);
      }
      // Increment retry count — will try again next minute
      await redis.set(key, JSON.stringify({ ...res, retryCount: attempts + 1 }));
      retried++;
      failed++;
    }
  }

  // --- 3. Self-diagnosis on each run ---
  const diagnosis = {
    totalSubs: subKeys.length,
    totalRes: resKeys.length,
    sent,
    failed,
    resSent,
    resCleaned,
    retried,
    skippedDup,
    healthy: failed === 0 && sent >= 0,
  };

  // Log to Redis for observability (keep last 60 runs = ~1 hour)
  const logEntry = JSON.stringify({ ...diagnosis, currentTime, ts: Date.now() });
  await redis.lpush('cron_log', logEntry);
  await redis.ltrim('cron_log', 0, 59);

  return NextResponse.json({ currentTime, ...diagnosis });
}
