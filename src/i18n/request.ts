import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import en from '../../messages/en.json';
import zh from '../../messages/zh.json';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

const messages = { en, zh };

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;
  const locale = locales.includes(localeCookie as Locale) ? localeCookie as Locale : defaultLocale;

  return {
    locale,
    messages: messages[locale]
  };
});
