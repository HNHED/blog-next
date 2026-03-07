'use client';

import { createContext, useContext, useState, useEffect, useTransition, type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale, locales, type Locale } from '@/i18n/config';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';

const messagesMap = { zh, en };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
  isPending: false,
});

export function useLocaleContext() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const match = document.cookie.split(';').find(c => c.trim().startsWith('locale='));
    const cookieLocale = match?.split('=')[1]?.trim();
    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
      setLocaleState(cookieLocale as Locale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      setLocaleState(newLocale);
    });
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isPending }}>
      <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
