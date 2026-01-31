'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'zh' ? 'en' : 'zh';
    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  const isZh = locale === 'zh';

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="relative flex items-center w-16 h-8 rounded-full bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/50 cursor-pointer hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 disabled:opacity-50"
      title={isZh ? 'Switch to English' : '切换到中文'}
    >
      {/* Sliding indicator */}
      <span
        className={`absolute top-0.5 w-[28px] h-[28px] rounded-full bg-white dark:bg-gray-700 shadow-sm transition-transform duration-300 ease-in-out ${
          isZh ? 'left-0.5' : 'left-[calc(100%-30px)]'
        }`}
      />
      {/* Labels */}
      <span
        className={`relative z-10 flex-1 text-center text-xs font-medium transition-colors duration-300 ${
          isZh ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        中
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-xs font-medium transition-colors duration-300 ${
          !isZh ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        En
      </span>
    </button>
  );
}
