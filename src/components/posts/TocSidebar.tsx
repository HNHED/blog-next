'use client';

import { useTranslations } from 'next-intl';
import type { TocItem } from '@/types/post';

export default function TocSidebar({ toc }: { toc: TocItem[] }) {
  const t = useTranslations('post');
  return (
    <aside className="w-64 hidden xl:block">
      <div className="sticky top-24">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          {t('tableOfContents')}
        </h3>
        <nav className="space-y-3 border-l border-gray-100 dark:border-gray-800">
          {toc.length > 0 ? (
            toc.map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                className={`block text-sm transition-all hover:text-teal-600 dark:hover:text-teal-400 border-l-2 -ml-[2px] ${item.level === 3
                    ? "pl-4 font-bold text-gray-700 dark:text-gray-300 border-transparent hover:border-teal-600"
                    : item.level === 4
                      ? "pl-8 text-gray-600 dark:text-gray-400 border-transparent hover:border-teal-400 text-xs"
                      : "pl-12 text-gray-500 dark:text-gray-500 border-transparent text-[11px]"
                  }`}
              >
                {item.text}
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-300 dark:text-gray-600 italic pl-4">{t('noHeadings')}</p>
          )}
        </nav>
      </div>
    </aside>
  );
}
