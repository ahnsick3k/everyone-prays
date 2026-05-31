'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function DesktopSidebar() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) {
      // Fallback: show manual instructions
      alert('브라우저 메뉴에서 "앱 설치" 또는 "홈 화면에 추가"를 선택해주세요.');
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }

  if (isInstalled) return null;

  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-content">
        <h1 className="sidebar-title">everyone-prays</h1>
        <p className="sidebar-desc">개인용 기도 기록 &amp; 알람 앱</p>

        <div className="sidebar-buttons">
          <a href="/install" className="sidebar-btn sidebar-btn-outline">
            설치 안내
          </a>
          <button onClick={handleInstall} className="sidebar-btn sidebar-btn-primary">
            📲 앱 설치하기
          </button>
        </div>
      </div>
    </aside>
  );
}
