import type { TocItem } from '@/types/post';

const extractToc = (markdown: string): TocItem[] => {
  const titles = markdown.match(/^#{1,5} .+/gm) || [];
  return titles.map((title) => {
    const level = title.match(/^#+/)?.[0].length || 0;
    const text = title.replace(/^#+ /, "").trim();
    // 生成一个简单的 ID 用于跳转
    const id = text.toLowerCase().replace(/\s+/g, "-");
    return { text, level, id };
  });
};

export {
  extractToc,
}