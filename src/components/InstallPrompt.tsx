'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }

  if (isInstalled || !showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        padding: '12px 20px',
        background: 'var(--color-interactive)',
        color: 'var(--color-text-on-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 300,
        fontSize: 14,
      }}
    >
      <span>📲 홈 화면에 설치하면 알림을 받을 수 있어요</span>
      <button
        onClick={handleInstall}
        style={{
          background: 'var(--color-accent-gold)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        설치
      </button>
    </div>
  );
}
