import type { TocItem } from '@/types/post';

/**
 * 移除 Markdown 格式字符，保留纯文本
 */
export const stripMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')   // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/`([^`]+)`/g, '$1')        // inline code
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')    // italic
    .replace(/^#+\s+/, '')              // heading markers if any left
    .trim();
};

/**
 * 生成用于跳转的 ID
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  return stripMarkdown(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, ''); // 仅保留中文、英文、数字、连字符
};

const extractToc = (markdown: string): TocItem[] => {
  // 匹配 h1 到 h5
  const titles = markdown.match(/^#{1,5} .+/gm) || [];
  return titles.map((title) => {
    const level = title.match(/^#+/)?.[0].length || 0;
    const rawText = title.replace(/^#+ /, "").trim();
    // 提取纯文本用于显示和生成 ID
    const text = stripMarkdown(rawText);
    const id = slugify(rawText);
    return { text, level, id };
  });
};

export {
  extractToc,
}
