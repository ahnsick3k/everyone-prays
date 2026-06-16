'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIos(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
    } else if (isIos) {
      // iOS: download .mobileconfig profile
      window.location.href = '/every1pray.mobileconfig';
    } else {
      setShowGuide(true);
    }
  }

  if (installed) {
    return (
      <div style={styles.container}>
        <img src="/icon-192.png" alt="" style={styles.icon} />
        <h1 style={styles.title}>설치 완료!</h1>
        <p style={styles.desc}>홈 화면에서 Every 1 Pray를 실행하세요</p>
        <a href="/" style={styles.cta}>앱 열기</a>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <img src="/icon-192.png" alt="Every 1 Pray" style={styles.icon} />
      <h1 style={styles.title}>Every 1 Pray</h1>
      <p style={styles.desc}>매일 한 사람을 위해 기도하세요</p>

      <div style={styles.badges}>
        <span style={styles.badge}>🙏 기도 기록</span>
        <span style={styles.badge}>⏰ 맞춤 알림</span>
        <span style={styles.badge}>📅 캘린더</span>
      </div>

      <button onClick={handleInstall} style={styles.cta}>
        설치하기
      </button>
      {isIos && (
        <button onClick={() => setShowGuide(true)} style={styles.fallbackLink}>
          프로파일 설치가 안 되나요?
        </button>
      )}
      <p style={styles.hint}>무료 · 앱스토어 불필요 · 1초 설치</p>

      {/* iOS Guide Overlay */}
      {showGuide && isIos && (
        <div style={styles.overlay} onClick={() => setShowGuide(false)}>
          <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sheetHandle} />
            <h3 style={styles.sheetTitle}>홈 화면에 추가</h3>

            <div style={styles.step}>
              <div style={styles.stepNum}>1</div>
              <div>
                <p style={styles.stepText}>하단 <strong>공유 버튼</strong>을 탭</p>
                <p style={styles.stepSub}>□ + ↑ 모양 아이콘</p>
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNum}>2</div>
              <div>
                <p style={styles.stepText}><strong>홈 화면에 추가</strong>를 탭</p>
                <p style={styles.stepSub}>목록 아래쪽에 있어요</p>
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNum}>3</div>
              <div>
                <p style={styles.stepText}>오른쪽 상단 <strong>추가</strong>를 탭</p>
                <p style={styles.stepSub}>완료! 홈에 아이콘 생겨요 🎉</p>
              </div>
            </div>

            <button onClick={() => setShowGuide(false)} style={styles.sheetBtn}>확인</button>
          </div>

          <div style={styles.arrowDown}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v14m0 0l-5-5m5 5l5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="19" width="16" height="2" rx="1" fill="#fff"/>
            </svg>
          </div>
        </div>
      )}

      {/* Non-iOS Guide */}
      {showGuide && !isIos && (
        <div style={styles.overlay} onClick={() => setShowGuide(false)}>
          <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sheetHandle} />
            <h3 style={styles.sheetTitle}>설치 방법</h3>
            <p style={{ ...styles.stepText, textAlign: 'center', padding: '16px 0' }}>
              주소창 오른쪽의 <strong>⊕ 설치 아이콘</strong>을 클릭하세요
            </p>
            <button onClick={() => setShowGuide(false)} style={styles.sheetBtn}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    background: '#000',
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 22,
    marginBottom: 20,
    boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    margin: '0 0 8px',
    letterSpacing: -0.5,
  },
  desc: {
    color: '#999',
    fontSize: 15,
    margin: '0 0 24px',
  },
  badges: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    marginBottom: 32,
  },
  badge: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '7px 13px',
    fontSize: 13,
    color: '#ccc',
  },
  cta: {
    display: 'inline-block',
    width: '100%',
    maxWidth: 300,
    padding: '16px 0',
    fontSize: 17,
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
  },
  hint: {
    fontSize: 12,
    color: '#555',
    marginTop: 12,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 9999,
    padding: '16px 16px 48px',
  },
  sheet: {
    background: '#1c1c1e',
    borderRadius: 20,
    padding: '12px 24px 24px',
    width: '100%',
    maxWidth: 340,
    marginBottom: 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    background: '#444',
    margin: '0 auto 16px',
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    margin: '0 0 20px',
    textAlign: 'center',
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 18,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    background: '#6366f1',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  stepText: {
    color: '#eee',
    fontSize: 14,
    margin: 0,
    lineHeight: 1.4,
  },
  stepSub: {
    color: '#888',
    fontSize: 12,
    margin: '2px 0 0',
  },
  sheetBtn: {
    width: '100%',
    marginTop: 8,
    padding: '13px 0',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  arrowDown: {
    animation: 'bounce 1.2s infinite',
    opacity: 0.9,
  },
  fallbackLink: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: 13,
    marginTop: 12,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};
