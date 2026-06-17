'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon as HomeOutline,
  CalendarIcon as CalendarOutline,
  ClockIcon as ClockOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  CalendarIcon as CalendarSolid,
  ClockIcon as ClockSolid,
} from '@heroicons/react/24/solid';

const tabs = [
  { href: '/every1pray/calendar', label: '캘린더', outline: CalendarOutline, solid: CalendarSolid },
  { href: '/every1pray', label: '홈', outline: HomeOutline, solid: HomeSolid },
  { href: '/every1pray/reservation', label: '예약', outline: ClockOutline, solid: ClockSolid },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        background: 'var(--color-surface-dark)',
        display: 'flex',
        height: 80,
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = isActive ? tab.solid : tab.outline;
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
            <Icon style={{ width: 24, height: 24 }} />
            <span className="text-nav">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
