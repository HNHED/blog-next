// 封面模板类型
export type CoverTemplate = 'gradient' | 'pattern' | 'minimal' | 'card';

// 封面布局类型
export type CoverLayout = 'center' | 'left' | 'bottom';

// 封面配置接口
export interface CoverConfig {
  template: CoverTemplate;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  title?: string;           // 自定义标题（默认用文章标题）
  subtitle?: string;        // 副标题（默认用第一个标签）
  icon?: string;            // 图标（emoji）
  layout: CoverLayout;
}

// 默认封面配置
export const DEFAULT_COVER_CONFIG: CoverConfig = {
  template: 'gradient',
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  textColor: '#ffffff',
  layout: 'center',
};

// 模板信息
export interface TemplateInfo {
  id: CoverTemplate;
  name: string;
  description: string;
}

// 预设颜色方案
export interface ColorScheme {
  primary: string;
  secondary: string;
  text?: string;
}
