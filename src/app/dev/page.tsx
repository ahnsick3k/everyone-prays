'use client';

import { useState } from 'react';

const SECRET = 'prayer-cron-secret-2026';
const BASE = 'https://everyone-prays.vercel.app';

interface Result {
  label: string;
  data: unknown;
  ok: boolean;
}

const BUTTONS = [
  { id: 'health', label: '🩺 Health Check', desc: '파이프라인 전체 진단' },
  { id: 'debug', label: '🔍 Debug State', desc: '구독/예약 현황' },
  { id: 'cron', label: '⏰ Cron Trigger', desc: '수동 cron 실행' },
  { id: 'test-push', label: '🔔 Test Push', desc: '테스트 알림 발송' },
  { id: 'force-push', label: '📣 Force Push', desc: '전체 강제 발송' },
  { id: 'cleanup', label: '🗑️ Full Cleanup', desc: 'Redis 전체 초기화' },
];

export default function DevPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  async function run(id: string, label: string) {
    setLoading(id);
    try {
      let res: Response;
      switch (id) {
        case 'health':
          res = await fetch(`${BASE}/api/health?secret=${SECRET}`);
          break;
        case 'debug':
          res = await fetch(`${BASE}/api/debug`, { headers: { Authorization: `Bearer ${SECRET}` } });
          break;
        case 'cron':
          res = await fetch(`${BASE}/api/cron/alarm`, { headers: { Authorization: `Bearer ${SECRET}` } });
          break;
        case 'test-push':
          res = await fetch(`${BASE}/api/push/test`, { method: 'POST' });
          break;
        case 'force-push':
          res = await fetch(`${BASE}/api/cron/alarm?force=true`, { headers: { Authorization: `Bearer ${SECRET}` } });
          break;
        case 'cleanup':
          if (!confirm('정말 전체 초기화?')) { setLoading(null); return; }
          res = await fetch(`${BASE}/api/debug`, { method: 'DELETE', headers: { Authorization: `Bearer ${SECRET}` } });
          break;
        default:
          return;
      }
      const data = await res.json();
      setResults((prev) => [{ label, data, ok: res.ok }, ...prev.slice(0, 9)]);
    } catch (e) {
      setResults((prev) => [{ label, data: String(e), ok: false }, ...prev.slice(0, 9)]);
    }
    setLoading(null);
  }

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto', fontFamily: '-apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>🛠 Dev Console</h1>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Every 1 Pray — Pipeline Control</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {BUTTONS.map((btn) => (
          <button
            key={btn.id}
            onClick={() => run(btn.id, btn.label)}
            disabled={loading === btn.id}
            style={{
              padding: '14px 10px',
              borderRadius: 12,
              border: '1px solid #333',
              background: loading === btn.id ? '#222' : '#111',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div>{btn.label}</div>
            <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>{btn.desc}</div>
          </button>
        ))}
      </div>

      <div>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 8,
              background: r.ok ? '#0a2a0a' : '#2a0a0a',
              border: `1px solid ${r.ok ? '#1a4a1a' : '#4a1a1a'}`,
              fontSize: 11,
              overflow: 'auto',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.label} {r.ok ? '✅' : '❌'}</div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#ccc' }}>
              {JSON.stringify(r.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30, padding: 16, background: '#1a1a2e', borderRadius: 12, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>홈 화면에 추가하려면:</p>
        <p style={{ fontSize: 12, color: '#666' }}>Safari 공유 버튼 → "홈 화면에 추가"</p>
      </div>
    </div>
  );
}
