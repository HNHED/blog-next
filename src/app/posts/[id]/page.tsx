import { postService } from "@/services/postService";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import RemoteMarkdown from '@/components/posts/RemoteMarkdown';
import { extractToc } from '@/utils/toc';
import CoverEditorWrapper from '@/components/cover/CoverEditorWrapper';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations('post');
  const tCommon = await getTranslations('common');

  // 1. 获取文章数据
  const post = await postService.getPostById(id).catch(() => null);

  if (!post) {
    return notFound();
  }
  const toc = extractToc(post.content);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <nav className="max-w-7xl mx-auto w-full px-6 py-8">
        <Link href="/" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft size={18} />
          <span>{tCommon('backToHome')}</span>
        </Link>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 flex gap-12">
        {/* 左侧：文章主体 */}
        <main className="flex-1 min-w-0 pb-20">
          <header className="mb-12">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag.name} className="text-blue-500 dark:text-blue-400">#{tag.name}</span>
                  ))}
                </div>
              </div>

              {/* 封面编辑按钮 - 仅管理员可见 */}
              <CoverEditorWrapper post={post} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
              {post.title}
            </h1>
          </header>

          <RemoteMarkdown content={post.content} />
        </main>

        {/* 右侧：固定大纲栏 */}
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
                    className={`block text-sm transition-all hover:text-blue-600 dark:hover:text-blue-400 border-l-2 -ml-[2px] ${item.level === 3
                        ? "pl-4 font-bold text-gray-700 dark:text-gray-300 border-transparent hover:border-blue-600"
                        : item.level === 4
                          ? "pl-8 text-gray-600 dark:text-gray-400 border-transparent hover:border-blue-400 text-xs"
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
      </div>
    </div>
  );
}
