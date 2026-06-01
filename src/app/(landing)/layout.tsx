import Link from 'next/link';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="landing-root">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/" className="landing-logo">EVERY 1 PRAY</Link>
          <nav className="landing-nav">
            <Link href="/about" className="landing-nav-link">소개</Link>
            <Link href="/install" className="landing-nav-link landing-nav-cta">설치하기</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="landing-footer">
        <p>© 2026 HUG CENTER. ALL RIGHTS RESERVED. EVERY 1 PRAY · 생각나는 그 사람을 위한 하루 1번의 중보기도</p>
      </footer>
    </div>
  );
}
