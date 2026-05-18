'use client';

import { useState, useEffect } from 'react';
import { db, type Prayer } from '@/lib/db';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [prayerDates, setPrayerDates] = useState<Set<string>>(new Set());
  const [dayPrayers, setDayPrayers] = useState<Prayer[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadPrayerDates();
  }, [year, month]);

  useEffect(() => {
    if (selectedDate) {
      loadDayPrayers(selectedDate);
    }
  }, [selectedDate]);

  async function loadPrayerDates() {
    const startKey = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endKey = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    const prayers = await db.prayers
      .where('date')
      .between(startKey, endKey, true, true)
      .toArray();
    setPrayerDates(new Set(prayers.map((p) => p.date)));
  }

  async function loadDayPrayers(date: string) {
    const prayers = await db.prayers
      .where('date')
      .equals(date)
      .sortBy('createdAt');
    setDayPrayers(prayers);
  }

  function getDaysInMonth() {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }

  function formatDateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const todayKey = new Date().toISOString().split('T')[0];
  const days = getDaysInMonth();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthStr = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <div style={{ padding: '48px 20px 32px' }}>
      {/* 월 네비게이션 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          style={{ width: 44, height: 44, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-primary)' }}
        >
          ‹
        </button>
        <h1 className="text-display-lg">{monthStr}</h1>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          style={{ width: 44, height: 44, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-primary)' }}
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {weekdays.map((d) => (
          <div key={d} className="text-caption" style={{ textAlign: 'center', padding: '8px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const dateKey = formatDateKey(day);
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const hasPrayer = prayerDates.has(dateKey);

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(dateKey)}
              style={{
                width: 40,
                height: 40,
                margin: '0 auto',
                borderRadius: '50%',
                border: isToday && !isSelected ? '2px solid var(--color-accent-gold)' : 'none',
                background: isSelected ? 'var(--color-interactive)' : 'transparent',
                color: isSelected ? 'var(--color-text-on-primary)' : 'var(--color-text-body)',
                fontSize: 15,
                fontWeight: isToday ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'background var(--duration-fast) var(--ease-out)',
              }}
            >
              {day}
              {hasPrayer && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isSelected ? 'var(--color-text-on-primary)' : 'var(--color-accent-gold)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜의 기도 기록 */}
      {selectedDate && (
        <div style={{ marginTop: 32 }}>
          <h2 className="text-title-lg" style={{ marginBottom: 16 }}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 기도
          </h2>
          {dayPrayers.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
              기도 기록이 없습니다
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dayPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  style={{
                    background: 'var(--color-surface-card)',
                    borderRadius: 'var(--radius-md)',
                    padding: 24,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p className="text-title-md" style={{ marginBottom: 8 }}>
                    {prayer.name}
                  </p>
                  <p className="text-body-lg" style={{ marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                    {prayer.content}
                  </p>
                  <span className="text-caption">
                    {new Date(prayer.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
