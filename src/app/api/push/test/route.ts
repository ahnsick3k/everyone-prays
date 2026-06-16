import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getMessaging } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  // Find the most recently updated subscription
  const subKeys = await redis.smembers('subscription_keys') as string[];

  let sent = 0;
  for (const key of subKeys) {
    const raw = await redis.get<string>(key);
    if (!raw) continue;

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!data?.fcmToken || data.fcmToken === 'undefined') continue;

    try {
      await getMessaging().send({
        token: data.fcmToken,
        data: {
          title: '🔔 테스트 알림',
          body: '알림이 정상적으로 동작합니다!',
          url: '/',
          tag: 'test-notification',
        },
        webpush: {
          headers: { Urgency: 'high' },
        },
      });
      sent++;
    } catch (error) {
      console.error('[Test Push] Error:', error);
    }
  }

  return NextResponse.json({ sent });
}
