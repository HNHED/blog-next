import { TemplateInfo, ColorScheme, CoverConfig, DEFAULT_COVER_CONFIG } from '@/types/cover';

// 根据标签自动匹配配色
export const TAG_COLOR_MAP: Record<string, ColorScheme> = {
  // 编程语言
  'javascript': { primary: '#f7df1e', secondary: '#323330', text: '#323330' },
  'typescript': { primary: '#3178c6', secondary: '#1e3a5f' },
  'react': { primary: '#61dafb', secondary: '#20232a' },
  'vue': { primary: '#42b883', secondary: '#35495e' },
  'nextjs': { primary: '#000000', secondary: '#333333' },
  'next.js': { primary: '#000000', secondary: '#333333' },
  'nodejs': { primary: '#339933', secondary: '#1a1a1a' },
  'node.js': { primary: '#339933', secondary: '#1a1a1a' },
  'python': { primary: '#3776ab', secondary: '#ffd43b', text: '#ffffff' },
  'rust': { primary: '#ce422b', secondary: '#1a1a1a' },
  'go': { primary: '#00add8', secondary: '#ffffff', text: '#000000' },
  'golang': { primary: '#00add8', secondary: '#ffffff', text: '#000000' },
  'java': { primary: '#007396', secondary: '#ed8b00' },
  'c++': { primary: '#00599c', secondary: '#004482' },
  'c#': { primary: '#512bd4', secondary: '#68217a' },
  'php': { primary: '#777bb4', secondary: '#4f5b93' },
  'ruby': { primary: '#cc342d', secondary: '#8b1a10' },
  'swift': { primary: '#fa7343', secondary: '#fd2d2d' },
  'kotlin': { primary: '#7f52ff', secondary: '#c711e1' },

  // 前端技术
  'css': { primary: '#264de4', secondary: '#2965f1' },
  'html': { primary: '#e34f26', secondary: '#f06529' },
  'tailwind': { primary: '#06b6d4', secondary: '#0891b2' },
  'sass': { primary: '#cc6699', secondary: '#bf4080' },
  'webpack': { primary: '#8dd6f9', secondary: '#1c78c0' },
  'vite': { primary: '#646cff', secondary: '#bd34fe' },

  // 后端/数据库
  'nestjs': { primary: '#e0234e', secondary: '#9b1c3c' },
  'express': { primary: '#000000', secondary: '#444444' },
  'django': { primary: '#092e20', secondary: '#0c4b33' },
  'flask': { primary: '#000000', secondary: '#3d3d3d' },
  'mongodb': { primary: '#47a248', secondary: '#116149' },
  'mysql': { primary: '#4479a1', secondary: '#00758f' },
  'postgresql': { primary: '#336791', secondary: '#0064a5' },
  'redis': { primary: '#dc382d', secondary: '#a41e11' },
  'graphql': { primary: '#e10098', secondary: '#b7006c' },

  // 分类标签
  '前端': { primary: '#667eea', secondary: '#764ba2' },
  '后端': { primary: '#11998e', secondary: '#38ef7d' },
  '全栈': { primary: '#fc466b', secondary: '#3f5efb' },
  '算法': { primary: '#fa709a', secondary: '#fee140' },
  '数据结构': { primary: '#a8edea', secondary: '#fed6e3', text: '#333333' },
  '设计模式': { primary: '#8360c3', secondary: '#2ebf91' },
  '架构': { primary: '#0f0c29', secondary: '#302b63' },
  '微服务': { primary: '#00c6ff', secondary: '#0072ff' },
  '云原生': { primary: '#4158d0', secondary: '#c850c0' },
  'devops': { primary: '#0d47a1', secondary: '#42a5f5' },
  'docker': { primary: '#2496ed', secondary: '#0db7ed' },
  'kubernetes': { primary: '#326ce5', secondary: '#ffffff', text: '#ffffff' },
  'k8s': { primary: '#326ce5', secondary: '#ffffff', text: '#ffffff' },

  // 通用
  '教程': { primary: '#6366f1', secondary: '#8b5cf6' },
  '笔记': { primary: '#14b8a6', secondary: '#06b6d4' },
  '总结': { primary: '#f59e0b', secondary: '#f97316' },
  '分享': { primary: '#ec4899', secondary: '#f43f5e' },
  '思考': { primary: '#6b7280', secondary: '#374151' },
  '生活': { primary: '#84cc16', secondary: '#22c55e' },

  // 默认
  'default': { primary: '#667eea', secondary: '#764ba2' },
};

// 模板列表
export const TEMPLATES: TemplateInfo[] = [
  { id: 'gradient', name: '渐变', description: '简洁的渐变背景' },
  { id: 'pattern', name: '几何', description: '带几何图案的背景' },
  { id: 'minimal', name: '极简', description: '纯色+大字标题' },
  { id: 'card', name: '卡片', description: '类小红书卡片风格' },
];

// 预设emoji图标
export const PRESET_ICONS = [
  '📝', '💡', '🚀', '⚡', '🔥', '✨', '🎯', '📚',
  '💻', '🖥️', '⌨️', '🔧', '🛠️', '⚙️', '🔌', '📡',
  '🌐', '🔒', '🔑', '📊', '📈', '🗂️', '📁', '🏗️',
  '🎨', '🖌️', '✏️', '📐', '🧮', '🔬', '🧪', '🧩',
];

// 预设布局
export const LAYOUTS = [
  { id: 'center', name: '居中', description: '标题居中显示' },
  { id: 'left', name: '左对齐', description: '标题靠左显示' },
  { id: 'bottom', name: '底部', description: '标题在底部显示' },
] as const;

// 根据标签获取颜色方案
export function getColorSchemeByTag(tagName: string): ColorScheme {
  const normalizedTag = tagName.toLowerCase().trim();
  return TAG_COLOR_MAP[normalizedTag] || TAG_COLOR_MAP['default'];
}

// 根据标签生成默认封面配置
export function generateDefaultCoverConfig(title: string, tags: string[]): CoverConfig {
  const firstTag = tags[0] || '';
  const colorScheme = getColorSchemeByTag(firstTag);

  return {
    ...DEFAULT_COVER_CONFIG,
    primaryColor: colorScheme.primary,
    secondaryColor: colorScheme.secondary,
    textColor: colorScheme.text || '#ffffff',
  };
}

// 一些额外的预设配色方案（供用户选择）
export const PRESET_COLOR_SCHEMES: { name: string; scheme: ColorScheme }[] = [
  { name: '紫罗兰', scheme: { primary: '#667eea', secondary: '#764ba2' } },
  { name: '翡翠绿', scheme: { primary: '#11998e', secondary: '#38ef7d' } },
  { name: '珊瑚粉', scheme: { primary: '#fc466b', secondary: '#3f5efb' } },
  { name: '日落橙', scheme: { primary: '#f7971e', secondary: '#ffd200' } },
  { name: '深海蓝', scheme: { primary: '#2193b0', secondary: '#6dd5ed' } },
  { name: '玫瑰红', scheme: { primary: '#ee0979', secondary: '#ff6a00' } },
  { name: '薄荷青', scheme: { primary: '#00b09b', secondary: '#96c93d' } },
  { name: '星空紫', scheme: { primary: '#0f0c29', secondary: '#302b63' } },
  { name: '极光蓝', scheme: { primary: '#4158d0', secondary: '#c850c0' } },
  { name: '暗夜黑', scheme: { primary: '#232526', secondary: '#414345' } },
];
