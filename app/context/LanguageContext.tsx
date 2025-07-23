'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '../../i18n';

interface LanguageContextType {
  currentLocale: Locale;
  setLanguage: (locale: Locale) => void;
  availableLocales: Locale[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract locale from pathname
    const pathLocale = pathname.split('/')[1] as Locale;
    if (locales.includes(pathLocale)) {
      setCurrentLocale(pathLocale);
    }
  }, [pathname]);

  const setLanguage = (locale: Locale) => {
    setCurrentLocale(locale);
    
    // Update URL to reflect new locale
    const currentPath = pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(id|en)/, '');
    const newPath = `/${locale}${pathWithoutLocale || ''}`;
    
    // Use replace to avoid adding to browser history
    router.replace(newPath);
  };

  const value: LanguageContextType = {
    currentLocale,
    setLanguage,
    availableLocales: [...locales],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 