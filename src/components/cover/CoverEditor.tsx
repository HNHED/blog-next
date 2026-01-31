'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CoverConfig, CoverTemplate, CoverLayout, DEFAULT_COVER_CONFIG } from '@/types/cover';
import { TEMPLATES, PRESET_ICONS, LAYOUTS, PRESET_COLOR_SCHEMES, generateDefaultCoverConfig } from '@/utils/coverPresets';
import CoverCanvas from './CoverCanvas';
import { Post } from '@/types/post';

interface CoverEditorProps {
  post: Post;
  onSave: (config: CoverConfig) => Promise<void>;
  onCancel?: () => void;
}

export default function CoverEditor({ post, onSave, onCancel }: CoverEditorProps) {
  // 初始化配置
  const initialConfig = useMemo(() => {
    if (post.coverConfig) {
      return post.coverConfig;
    }
    return generateDefaultCoverConfig(post.title, post.tags.map(t => t.name));
  }, [post]);

  const [config, setConfig] = useState<CoverConfig>(initialConfig);
  const [preview, setPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'template' | 'color' | 'content'>('template');
  const t = useTranslations('cover');
  const tCommon = useTranslations('common');

  // 更新配置
  const updateConfig = useCallback((updates: Partial<CoverConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // 重置为默认配置
  const handleReset = useCallback(() => {
    const defaultConfig = generateDefaultCoverConfig(post.title, post.tags.map(t => t.name));
    setConfig(defaultConfig);
  }, [post]);

  // 保存配置
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
    } finally {
      setSaving(false);
    }
  };

  const firstTag = post.tags[0]?.name;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* 预览区域 */}
      <div className="relative bg-gray-100 dark:bg-gray-900 p-4">
        <div className="aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <CoverCanvas
            config={config}
            title={post.title}
            tag={firstTag}
            width={800}
            height={450}
            onGenerated={setPreview}
          />
          {preview && (
            <img
              src={preview}
              alt="封面预览"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="p-6">
        {/* Tab 导航 */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'template', label: t('template') },
            { id: 'color', label: t('presetColors') },
            { id: 'content', label: 'Content' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 模板选择 */}
        {activeTab === 'template' && (
          <div className="space-y-6">
            {/* 模板类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('template')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TEMPLATES.map(t_item => (
                  <button
                    key={t_item.id}
                    onClick={() => updateConfig({ template: t_item.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      config.template === t_item.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {t_item.id === 'gradient' && '🌈'}
                      {t_item.id === 'pattern' && '🔷'}
                      {t_item.id === 'minimal' && '⬜'}
                      {t_item.id === 'card' && '🃏'}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{t(`templates.${t_item.id}` as any)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t(`templates.${t_item.id}Desc` as any)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 布局选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('layout')}
              </label>
              <div className="flex gap-3">
                {LAYOUTS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => updateConfig({ layout: l.id })}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      config.layout === l.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{t(`layouts.${l.id}` as any)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 配色设置 */}
        {activeTab === 'color' && (
          <div className="space-y-6">
            {/* 预设配色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('presetColors')}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLOR_SCHEMES.map(({ name, scheme }) => (
                  <button
                    key={name}
                    onClick={() => updateConfig({
                      primaryColor: scheme.primary,
                      secondaryColor: scheme.secondary,
                      textColor: scheme.text || '#ffffff',
                    })}
                    className="group relative"
                    title={name}
                  >
                    <div
                      className="w-full aspect-square rounded-lg shadow-sm hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})`,
                      }}
                    />
                    <span className="absolute inset-x-0 bottom-0 text-[10px] text-center text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义颜色 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('primaryColor')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={e => updateConfig({ primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={e => updateConfig({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('secondaryColor')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={e => updateConfig({ secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={e => updateConfig({ secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('textColor')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={e => updateConfig({ textColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={config.textColor}
                    onChange={e => updateConfig({ textColor: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 内容设置 */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* 自定义标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('coverTitle')}
              </label>
              <input
                type="text"
                placeholder={post.title}
                value={config.title || ''}
                onChange={e => updateConfig({ title: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">{t('coverTitlePlaceholder')}</p>
            </div>

            {/* 副标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('subtitle')}
              </label>
              <input
                type="text"
                placeholder={firstTag ? `#${firstTag}` : t('subtitlePlaceholder')}
                value={config.subtitle || ''}
                onChange={e => updateConfig({ subtitle: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">{t('subtitlePlaceholder')}</p>
            </div>

            {/* 图标选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('icon')}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateConfig({ icon: undefined })}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm transition-all ${
                    !config.icon
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('none')}
                </button>
                {PRESET_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => updateConfig({ icon })}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                      config.icon === icon
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {t('resetDefault')}
          </button>

          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tCommon('cancel')}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('saving') : t('saveCover')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
