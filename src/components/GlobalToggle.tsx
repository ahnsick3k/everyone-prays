'use client';

import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function GlobalToggle() {
  const { lang, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <div className="global-toggle">
      <button
        onClick={toggleTheme}
        className="global-toggle-btn"
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light'
          ? <MoonIcon style={{ width: 18, height: 18 }} />
          : <SunIcon style={{ width: 18, height: 18 }} />
        }
      </button>
      <button
        onClick={toggleLang}
        className="global-toggle-btn"
        aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
      >
        <GlobeAltIcon style={{ width: 18, height: 18 }} />
        <span className="global-toggle-label">{lang === 'ko' ? 'EN' : 'KR'}</span>
      </button>
    </div>
  );
}
