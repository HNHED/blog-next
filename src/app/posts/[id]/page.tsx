import { postService } from "@/services/postService";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import RemoteMarkdown from '@/components/posts/RemoteMarkdown';
import { extractToc } from '@/utils/toc';
import CoverEditorWrapper from '@/components/cover/CoverEditorWrapper';
import BackToHomeLink from '@/components/common/BackToHomeLink';
import TocSidebar from '@/components/posts/TocSidebar';

export const revalidate = 3600;

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await postService.getPostById(id).catch(() => null);

  if (!post) {
    return notFound();
  }
  const toc = extractToc(post.content);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="max-w-7xl mx-auto w-full px-6 py-8">
        <BackToHomeLink />
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 flex gap-12 pb-20">
        {/* 左侧：文章主体 */}
        <main className="flex-1 min-w-0">
          <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-300/20 dark:shadow-gray-900/40">
            {/* 顶部装饰线 */}
            <div className="h-[3px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

            <div className="p-8 lg:p-12">
              <header className="mb-12">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span key={tag.name} className="text-teal-600 dark:text-teal-400">#{tag.name}</span>
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
            </div>
          </div>
        </main>

        {/* 右侧：固定大纲栏 */}
        <TocSidebar toc={toc} />
      </div>
    </div>
  );
}
