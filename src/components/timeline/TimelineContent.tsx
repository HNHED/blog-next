'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { Post } from '@/types/post';
import dynamic from 'next/dynamic';

const CoverPreview = dynamic(() => import('@/components/cover/CoverPreview'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full animate-pulse bg-gray-50 rounded-lg" />
  )
});

interface TimelineContentProps {
  posts: Post[];
}

interface GroupedPosts {
  year: number;
  months: {
    month: number;
    monthName: string;
    posts: Post[];
  }[];
}

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_ZH = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export default function TimelineContent({ posts }: TimelineContentProps) {
  const t = useTranslations('timeline');
  const tCommon = useTranslations('common');

  // 检测当前语言
  const isZh = t('title') === '文章时间线';
  const MONTH_NAMES = isZh ? MONTH_NAMES_ZH : MONTH_NAMES_EN;
  // 按年月分组文章
  const groupedPosts = useMemo(() => {
    const groups: Map<number, Map<number, Post[]>> = new Map();

    posts.forEach(post => {
      const date = new Date(post.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!groups.has(year)) {
        groups.set(year, new Map());
      }
      const yearGroup = groups.get(year)!;

      if (!yearGroup.has(month)) {
        yearGroup.set(month, []);
      }
      yearGroup.get(month)!.push(post);
    });

    // 转换为数组并排序
    const result: GroupedPosts[] = [];
    const sortedYears = Array.from(groups.keys()).sort((a, b) => b - a);

    sortedYears.forEach(year => {
      const yearGroup = groups.get(year)!;
      const sortedMonths = Array.from(yearGroup.keys()).sort((a, b) => b - a);

      const months = sortedMonths.map(month => ({
        month,
        monthName: MONTH_NAMES[month],
        posts: yearGroup.get(month)!.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }));

      result.push({ year, months });
    });

    return result;
  }, [posts]);

  // 统计信息
  const stats = useMemo(() => {
    const years = new Set(posts.map(p => new Date(p.createdAt).getFullYear())).size;
    return { total: posts.length, years };
  }, [posts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            <span>{tCommon('backToHome')}</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Calendar className="text-teal-500" size={32} />
                {t('title')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {t('description')}
              </p>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.total}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('articles')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.years}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('years')}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {groupedPosts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">{t('noArticles')}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] sm:left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-teal-500 to-cyan-500 dark:from-teal-500 dark:via-teal-600 dark:to-cyan-600" />

            {groupedPosts.map(({ year, months }) => (
              <div key={year} className="mb-12">
                {/* Year marker */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-500/30 flex items-center justify-center z-10">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {year}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent" />
                </div>

                {months.map(({ month, monthName, posts: monthPosts }) => (
                  <div key={month} className="mb-8 ml-2 sm:ml-3">
                    {/* Month marker */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative z-10">
                        <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-teal-400 dark:border-teal-500" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-teal-400/30 dark:bg-teal-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {monthName}
                      </h3>
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        {monthPosts.length} {t('article')}
                      </span>
                    </div>

                    {/* Posts */}
                    <div className="ml-6 sm:ml-8 space-y-4">
                      {monthPosts.map((post, index) => (
                        <Link
                          key={post.id}
                          href={`/posts/${post.id}`}
                          className="group block"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <article className="flex gap-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300">
                            {/* Mini cover */}
                            <div className="hidden sm:block w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                              <CoverPreview
                                index={index}
                                title={post.title}
                                tag={post.tags[0]?.name}
                                coverConfig={post.coverConfig}
                                width={200}
                                height={140}
                                fontScale={0.6}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
                                <time>
                                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </time>
                                {post.tags.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-teal-600 dark:text-teal-400">
                                      {post.tags[0].name}
                                    </span>
                                  </>
                                )}
                              </div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                                {post.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 hidden sm:block">
                                {post.content.replace(/[#*`\[\]]/g, '').slice(0, 100)}...
                              </p>
                            </div>

                            {/* Arrow */}
                            <div className="hidden sm:flex items-center">
                              <svg
                                className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 group-hover:translate-x-1 transition-all"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* End marker */}
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center z-10">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white dark:bg-gray-800" />
              </div>
              <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                {t('theBeginning')}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
