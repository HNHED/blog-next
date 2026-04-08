import React, { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { contributionService, ContributionData } from '@/services/contributionService';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

interface ContributionChartProps {
  className?: string;
}

export const ContributionChart: React.FC<ContributionChartProps> = ({ className = '' }) => {
  const t = useTranslations('contribution');
  const [contributionData, setContributionData] = useState<ContributionData[]>([]);
  const [stats, setStats] = useState<{ totalContributions: number; todayContributions: number; streak: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const getColor = (count: number): string => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 2) return 'bg-blue-200 dark:bg-blue-900';
    if (count <= 5) return 'bg-blue-400 dark:bg-blue-700';
    if (count <= 8) return 'bg-blue-600 dark:bg-blue-500';
    return 'bg-blue-800 dark:bg-blue-400';
  };

  const calendarGrid = useMemo(() => {
    const startOfYear = dayjs(`${selectedYear}-01-01`);
    const endOfYear = dayjs(`${selectedYear}-12-31`);
    let currentPointer = startOfYear.day(0);

    const dataMap = new Map(contributionData.map(d => [d.date, d.count]));
    const weeks = [];

    while (currentPointer.isBefore(endOfYear) || currentPointer.isSame(endOfYear, 'day')) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = currentPointer.add(i, 'day');
        const dateStr = day.format('YYYY-MM-DD');
        week.push({
          date: dateStr,
          count: dataMap.get(dateStr) || 0,
          isCurrentYear: day.year() === selectedYear,
          monthLabel: day.date() <= 7 && day.day() === 0 ? day.format('M月') : null
        });
      }
      weeks.push(week);
      currentPointer = currentPointer.add(7, 'day');
    }
    return weeks;
  }, [selectedYear, contributionData]);

  const fetchContributionData = async (year: number) => {
    setLoading(true);
    try {
      const [data, statsData] = await Promise.all([
        contributionService.getContributions(`${year}-01-01`, `${year}-12-31`),
        contributionService.getStats(),
      ]);
      setContributionData(data);
      setStats(statsData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributionData(selectedYear);
  }, [selectedYear]);

  if (loading) return <div className="flex justify-center py-20 text-gray-400 italic">{t('loading')}</div>;

  return (
    <div className={`
      [--block-size:10px] [--block-gap:2px]
      sm:[--block-size:11px] sm:[--block-gap:2px]
      md:[--block-size:12px] md:[--block-gap:3px]
      
      p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 
      w-full mx-auto ${className}
    `}>
      {/* 头部信息 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        {/* 标题和年份选择 */}
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('title')}</h3>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 outline-none"
          >
            {[0, 1, 2, 3, 4].map(i => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>

        {/* 图例和统计信息 - 移动端垂直排列 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* 图例 */}
          <div className="flex items-center justify-end space-x-2">
            <span className="text-[11px] text-gray-400">{t('less')}</span>
            {[0, 1, 2, 5, 10].map(v => (
              <div key={v} className={`w-3 h-3 rounded-sm ${getColor(v)}`} />
            ))}
            <span className="text-[11px] text-gray-400">{t('more')}</span>
          </div>
          
          {/* 统计信息 */}
          {stats && (
            <div className="flex space-x-6">
              <div className="flex flex-col items-end sm:items-center">
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{t('total')}</span>
                <span className="text-lg font-mono text-gray-700 dark:text-gray-200">{stats.totalContributions}</span>
              </div>
              <div className="flex flex-col items-end sm:items-center">
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{t('streak')}</span>
                <span className="text-lg font-mono text-gray-700 dark:text-gray-200">{stats.streak} {t('days')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 核心图表区域 */}
      <div className="overflow-x-auto custom-scrollbar">
        {/* 这里的 min-w-max 确保在小屏幕上由于滚动不会导致挤压偏移 */}
        <div className="min-w-max flex flex-col">

          {/* 月份标题行 - 偏移对齐 */}
          <div className="flex mb-1 ml-[18px] sm:ml-[24px]" style={{ gap: 'var(--block-gap)' }}>
            {calendarGrid.map((week, i) => (
              <div key={i} style={{ width: 'var(--block-size)' }} className="text-[10px] sm:text-[11px] text-gray-400 flex-shrink-0">
                {week[0].monthLabel && <span className="whitespace-nowrap">{week[0].monthLabel}</span>}
              </div>
            ))}
          </div>

          <div className="flex items-start">
            {/* 左侧星期 - 使用 Grid 且与右侧方块共享相同的布局逻辑 */}
            <div className="grid grid-rows-7 mr-2" style={{ gap: 'var(--block-gap)' }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div
                  key={i}
                  style={{ height: 'var(--block-size)', fontSize: 'calc(var(--block-size) * 0.8)' }}
                  className="text-gray-400 font-medium leading-none flex items-center justify-center w-[12px] sm:w-[16px]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 右侧方块矩阵 */}
            <div className="flex" style={{ gap: 'var(--block-gap)' }}>
              {calendarGrid.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-rows-7" style={{ gap: 'var(--block-gap)' }}>
                  {week.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} contributions`}
                      style={{ width: 'var(--block-size)', height: 'var(--block-size)' }}
                      className={`
                        rounded-[1px] sm:rounded-[2px] transition-all duration-300
                        ${day.isCurrentYear ? getColor(day.count) : 'bg-transparent'}
                        ${day.isCurrentYear ? 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-500 cursor-pointer' : ''}
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};