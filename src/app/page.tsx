'use client';

import { useState, useEffect } from 'react';
import { db, type Prayer, type Alarm } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { initPushNotifications, updateAlarmOnServer, getFcmTokenAsync } from '@/lib/push';

export default function HomePage() {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [recentNames, setRecentNames] = useState<string[]>([]);
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [saving, setSaving] = useState(false);
  const [today, setToday] = useState(() => new Date());

  const dateStr = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const dateKey = today.toISOString().split('T')[0];

  useEffect(() => {
    loadAlarm();
    loadRecentNames();
    // Check push permission status
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }

    // Always refresh token on app open (ensures server subscription exists)
    getFcmTokenAsync().then((t) => {
      if (t) console.log('[Home] Token ready:', t.slice(0, 12) + '...');
      else console.warn('[Home] No push token available');
    });

    // Update date when app returns from background
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setToday(new Date());
        // Also refresh token when coming back from background
        getFcmTokenAsync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  async function loadAlarm() {
    const alarms = await db.alarms.toArray();
    if (alarms.length > 0) {
      setAlarm(alarms[0]);
    }
  }

  async function loadRecentNames() {
    const prayers = await db.prayers.orderBy('createdAt').reverse().limit(20).toArray();
    const names = [...new Set(prayers.map((p) => p.name))].slice(0, 5);
    setRecentNames(names);
  }

  async function handleSave() {
    if (!name.trim() || !content.trim() || saving) return;
    setSaving(true);

    const prayer: Prayer = {
      id: uuidv4(),
      name: name.trim(),
      content: content.trim(),
      date: dateKey,
      createdAt: Date.now(),
    };

    await db.prayers.add(prayer);
    setContent('');
    setShowToast(true);
    loadRecentNames();
    setTimeout(() => setShowToast(false), 2000);
    setSaving(false);
  }

  async function handleAlarmToggle() {
    if (!alarm) {
      const newAlarm: Alarm = { id: uuidv4(), time: '06:00', enabled: true, repeat: true };
      await db.alarms.add(newAlarm);
      setAlarm(newAlarm);
      const token = await initPushNotifications({ time: newAlarm.time, enabled: true });
      if (token) {
        setNotifPermission('granted');
      } else {
        setNotifPermission('denied');
        alert('알림 권한을 허용해주세요. 설정 > 알림에서 변경할 수 있습니다.');
      }
    } else {
      const updated = { ...alarm, enabled: !alarm.enabled };
      await db.alarms.put(updated);
      setAlarm(updated);
      if (updated.enabled) {
        const token = await initPushNotifications({ time: updated.time, enabled: true });
        if (token) setNotifPermission('granted');
      } else {
        await updateAlarmOnServer({ time: updated.time, enabled: false });
      }
    }
  }

  async function handleAlarmTimeChange(time: string) {
    if (!alarm) return;
    const updated = { ...alarm, time };
    await db.alarms.put(updated);
    setAlarm(updated);
    if (updated.enabled) {
      await updateAlarmOnServer({ time, enabled: true });
    }
  }

  return (
    <div style={{ padding: '48px 20px 32px' }}>
      {/* 날짜 */}
      <h1 className="text-display-xl" style={{ marginBottom: 48 }}>
        {dateStr}
      </h1>

      {/* 이름 입력 */}
      <div style={{ marginBottom: 24 }}>
        <label className="text-caption" style={{ display: 'block', marginBottom: 8 }}>
          누구를 위해 기도할까요?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="기도 대상을 입력해주세요."
          style={{
            width: '100%',
            height: 48,
            padding: '14px 16px',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 15,
            color: 'var(--color-text-body)',
            outline: 'none',
            transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-interactive)';
            e.target.style.boxShadow = '0 0 0 3px rgba(60,19,33,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {recentNames.length > 0 && !name && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {recentNames.map((n) => (
              <button
                key={n}
                onClick={() => setName(n)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(60,19,33,0.05)',
                  border: 'none',
                  fontSize: 13,
                  color: 'var(--color-text-body)',
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 기도문 입력 */}
      <div style={{ marginBottom: 24 }}>
        <label className="text-caption" style={{ display: 'block', marginBottom: 8 }}>
          기도 제목
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="기도 제목을 알려주세요."
          style={{
            width: '100%',
            minHeight: 120,
            padding: '14px 16px',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 16,
            lineHeight: 1.6,
            color: 'var(--color-text-body)',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-interactive)';
            e.target.style.boxShadow = '0 0 0 3px rgba(60,19,33,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={!name.trim() || !content.trim() || saving}
        style={{
          width: '100%',
          height: 48,
          background: name.trim() && content.trim() && !saving ? 'var(--color-interactive)' : 'var(--color-interactive-disabled)',
          color: 'var(--color-text-on-primary)',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          fontSize: 15,
          fontWeight: 600,
          cursor: name.trim() && content.trim() && !saving ? 'pointer' : 'not-allowed',
          transition: 'background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)',
        }}
        onMouseDown={(e) => { if (name.trim() && content.trim() && !saving) e.currentTarget.style.transform = 'scale(0.97)'; }}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {saving ? '저장 중...' : '기도하기'}
      </button>

      {/* 알람 섹션 */}
      <div
        style={{
          marginTop: 48,
          padding: 24,
          background: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-accent-gold)' }}>notifications</span>
            <span className="text-title-lg">
              {alarm ? alarm.time : '06:00'}
            </span>
          </div>
          {alarm && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <input
                type="time"
                value={alarm.time}
                onChange={(e) => handleAlarmTimeChange(e.target.value)}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: 14,
                  color: 'var(--color-text-body)',
                  background: 'transparent',
                }}
              />
              <button
                onClick={() => {
                  const now = new Date();
                  const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  handleAlarmTimeChange(t);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  fontSize: 12,
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                현재시각
              </button>
            </div>
          )}
        </div>
        {/* Toggle */}
        <button
          onClick={handleAlarmToggle}
          style={{
            width: 48,
            height: 28,
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: alarm?.enabled ? 'var(--color-accent-gold)' : 'rgba(60,19,33,0.15)',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background var(--duration-base) var(--ease-spring)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: alarm?.enabled ? 22 : 2,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#FFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left var(--duration-base) var(--ease-spring)',
            }}
          />
        </button>
      </div>

      {/* 알림 상태 표시 */}
      {notifPermission !== 'granted' && (
        <p className="text-caption" style={{ marginTop: 12, color: 'var(--color-error)', textAlign: 'center' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>warning</span>
          알림 권한이 없습니다. 토글을 켜서 알림을 허용해주세요.
        </p>
      )}
      {notifPermission === 'granted' && alarm?.enabled && (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <p className="text-caption" style={{ color: 'var(--color-success)', marginBottom: 8 }}>
            ✓ 알림 활성화됨 · 매일 {alarm.time}에 알림
          </p>
          <button
            onClick={async () => {
              const res = await fetch('/api/push/test', { method: 'POST' });
              if (res.ok) alert('알림이 왔나요? 알림이 2분내로 오지 않는다면, 운영진에게 알려주세요.');
            }}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>notifications_active</span>
            알림 테스트
          </button>
        </div>
      )}

      {/* 저장 완료 토스트 */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-interactive)',
            color: 'var(--color-text-on-primary)',
            padding: '14px 24px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 15,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            zIndex: 200,
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 4 }}>check_circle</span>
          기도하겠습니다
        </div>
      )}
    </div>
  );
}
