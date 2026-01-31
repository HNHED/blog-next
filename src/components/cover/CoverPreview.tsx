'use client';

import { useState, useEffect, useMemo } from 'react';
import { CoverConfig, DEFAULT_COVER_CONFIG } from '@/types/cover';
import { generateDefaultCoverConfig } from '@/utils/coverPresets';
import CoverCanvas from './CoverCanvas';

interface CoverPreviewProps {
  title: string;
  tag?: string;
  coverConfig?: CoverConfig | null;
  className?: string;
  width?: number;
  height?: number;
  fontScale?: number;
}

export default function CoverPreview({
  title,
  tag,
  coverConfig,
  className = '',
  width = 800,
  height = 450,
  fontScale,
}: CoverPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  // 合并配置，如果没有提供则根据标签生成默认配置
  const config = useMemo(() => {
    if (coverConfig) {
      return coverConfig;
    }
    // 根据标签生成默认配置
    return generateDefaultCoverConfig(title, tag ? [tag] : []);
  }, [coverConfig, title, tag]);

  // 生成封面后的回调
  const handleGenerated = (dataUrl: string) => {
    setImageUrl(dataUrl);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Canvas 生成器（隐藏） */}
      <CoverCanvas
        config={config}
        title={title}
        tag={tag}
        width={width}
        height={height}
        fontScale={fontScale}
        onGenerated={handleGenerated}
      />

      {/* 显示生成的图片 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`封面: ${title}`}
          className="w-full h-full object-cover"
        />
      ) : (
        // 加载中的占位
        <div
          className="w-full h-full animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
          }}
        />
      )}
    </div>
  );
}
