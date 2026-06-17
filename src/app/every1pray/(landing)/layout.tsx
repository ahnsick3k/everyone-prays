'use client';

import Link from 'next/link';
import GlobalToggle from '@/components/GlobalToggle';
import { useLang } from '@/contexts/LangContext';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { lang } = useLang();

  return (
    <div className="landing-root">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/every1pray" className="landing-logo">EVERY 1 PRAY</Link>
          <nav className="landing-nav">
            <GlobalToggle />
            <Link href="/every1pray/about" className="landing-nav-link">
              {lang === 'ko' ? '소개' : 'About'}
            </Link>
            <Link href="/every1pray/install" className="landing-nav-link landing-nav-cta">
              {lang === 'ko' ? '설치하기' : 'Install'}
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="landing-footer">
        <p>© 2026 HUG CENTER. ALL RIGHTS RESERVED. EVERY 1 PRAY · 생각나는 그 사람을 위한 하루 1번의 중보기도</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.5 }}>
          <Link href="/every1pray/privacy" style={{ textDecoration: 'underline' }}>
            {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
          </Link>
        </p>
      </footer>
    </div>
  );
}
