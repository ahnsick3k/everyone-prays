'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/calendar', label: '캘린더', icon: CalendarIcon },
  { href: '/', label: '홈', icon: HomeIcon },
  { href: '/reservation', label: '예약', icon: ClockIcon },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: 'var(--color-surface-dark)',
        display: 'flex',
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: isActive ? 'var(--color-text-on-primary)' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              transition: 'background var(--duration-fast) var(--ease-out)',
            }}
          >
            <tab.icon filled={isActive} />
            <span className="text-nav">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function HomeIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l9-9 9 9" />
      <path d="M5 12v7a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-7" />
    </svg>
  );
}

function CalendarIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
