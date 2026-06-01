'use client';

import { useState, useEffect } from 'react';
import { db, type Reservation } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export default function ReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('06:00');

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    const items = await db.reservations.orderBy('scheduledAt').toArray();
    setReservations(items);
  }

  async function handleAdd() {
    if (!name.trim() || !content.trim() || !scheduledDate) return;

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).getTime();
    const reservation: Reservation = {
      id: uuidv4(),
      name: name.trim(),
      content: content.trim(),
      scheduledAt,
      notified: false,
      createdAt: Date.now(),
    };

    await db.reservations.add(reservation);
    setName('');
    setContent('');
    setScheduledDate('');
    setScheduledTime('06:00');
    setShowForm(false);
    loadReservations();
  }

  async function handleDelete(id: string) {
    await db.reservations.delete(id);
    loadReservations();
  }

  function formatScheduledTime(timestamp: number) {
    const d = new Date(timestamp);
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) +
      ' ' + d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  const now = Date.now();

  return (
    <div style={{ padding: '48px 20px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 className="text-display-lg">예약</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: 'var(--color-interactive)',
            color: 'var(--color-text-on-primary)',
            fontSize: 24,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform var(--duration-fast) var(--ease-out)',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {showForm ? '×' : '+'}
        </button>
      </div>

      {/* 예약 작성 폼 */}
      {showForm && (
        <div
          style={{
            background: 'var(--color-surface-card)',
            borderRadius: 'var(--radius-md)',
            padding: 24,
            border: '1px solid var(--color-border)',
            marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label className="text-caption" style={{ display: 'block', marginBottom: 8 }}>날짜 & 시간</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  flex: 1,
                  height: 48,
                  padding: '14px 16px',
                  background: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 15,
                  color: 'var(--color-text-body)',
                }}
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                style={{
                  width: 120,
                  height: 48,
                  padding: '14px 12px',
                  background: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 15,
                  color: 'var(--color-text-body)',
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="text-caption" style={{ display: 'block', marginBottom: 8 }}>기도 대상</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
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
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="text-caption" style={{ display: 'block', marginBottom: 8 }}>기도문</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="기도문을 작성하세요..."
              style={{
                width: '100%',
                minHeight: 100,
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
              }}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!name.trim() || !content.trim() || !scheduledDate}
            style={{
              width: '100%',
              height: 48,
              background: name.trim() && content.trim() && scheduledDate ? 'var(--color-interactive)' : 'var(--color-interactive-disabled)',
              color: 'var(--color-text-on-primary)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              fontSize: 15,
              fontWeight: 600,
              cursor: name.trim() && content.trim() && scheduledDate ? 'pointer' : 'not-allowed',
            }}
          >
            예약 저장
          </button>
        </div>
      )}

      {/* 예약 목록 */}
      {reservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
            예약된 기도가 없습니다
          </p>
          <p className="text-caption" style={{ marginTop: 8 }}>
            + 버튼을 눌러 기도를 예약하세요
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reservations.map((res) => {
            const isPast = res.scheduledAt < now;
            return (
              <div
                key={res.id}
                style={{
                  background: 'var(--color-surface-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  border: '1px solid var(--color-border)',
                  borderLeft: '4px solid var(--color-accent-gold)',
                  opacity: isPast ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p className="text-caption" style={{ color: 'var(--color-accent-gold)', marginBottom: 4 }}>
                      {formatScheduledTime(res.scheduledAt)}
                      {isPast && ' (지남)'}
                    </p>
                    <p className="text-title-md" style={{ marginBottom: 4 }}>
                      {res.name}
                    </p>
                    <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
                      {res.content.length > 50 ? res.content.slice(0, 50) + '...' : res.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(res.id)}
                    style={{
                      width: 32,
                      height: 32,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--color-error)',
                      fontSize: 18,
                      cursor: 'pointer',
                      borderRadius: '50%',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
