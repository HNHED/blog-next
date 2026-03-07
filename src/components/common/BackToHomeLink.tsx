'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToHomeLink() {
  const t = useTranslations('common');
  return (
    <Link href="/" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
      <ArrowLeft size={18} />
      <span>{t('backToHome')}</span>
    </Link>
  );
}
