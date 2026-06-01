'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Lang = 'ko' | 'en';

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'ko',
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko');
  const toggle = useCallback(() => setLang((l) => (l === 'ko' ? 'en' : 'ko')), []);

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
