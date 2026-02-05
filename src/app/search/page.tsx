import { postService } from "@/services/postService";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

function HighlightText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim()) return <>{text}</>;

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-teal-200/60 dark:bg-teal-700/40 text-inherit rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function getContentSnippet(content: string, keyword: string, maxLen = 200): string {
  if (!content) return "";

  const lower = content.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());

  if (idx === -1) return content.slice(0, maxLen);

  const start = Math.max(0, idx - 60);
  const end = Math.min(content.length, idx + keyword.length + maxLen - 60);
  let snippet = content.slice(start, end);

  // 清理 markdown 语法
  snippet = snippet.replace(/[#*`>\-_~\[\]()!]/g, " ").replace(/\s+/g, " ").trim();

  return (start > 0 ? "..." : "") + snippet + (end < content.length ? "..." : "");
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: keyword = "" } = await searchParams;
  const t = await getTranslations('common');

  let posts: Awaited<ReturnType<typeof postService.searchPosts>> = [];
  if (keyword.trim()) {
    posts = await postService.searchPosts(keyword).catch(() => []);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="max-w-5xl mx-auto w-full px-6 py-8">
        <Link href="/" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
          <ArrowLeft size={18} />
          <span>{t('backToHome')}</span>
        </Link>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 pb-20">
        {/* 搜索头部 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Search size={24} className="text-teal-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {keyword ? (
                <>搜索: <span className="text-teal-600 dark:text-teal-400">&ldquo;{keyword}&rdquo;</span></>
              ) : (
                "搜索"
              )}
            </h1>
          </div>
          {keyword && (
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-9">
              找到 {posts.length} 篇相关文章
            </p>
          )}
        </div>

        {/* 搜索结果 */}
        {!keyword.trim() ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-400 dark:text-gray-500">请输入关键词进行搜索</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
              <Search size={28} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-400 dark:text-gray-500">没有找到与 &ldquo;{keyword}&rdquo; 相关的文章</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => {
              const snippet = getContentSnippet(post.content, keyword);

              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:border-teal-300/50 dark:hover:border-teal-600/50 transition-all p-6"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* 标题 */}
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    <HighlightText text={post.title} keyword={keyword} />
                  </h2>

                  {/* 内容摘要 */}
                  {snippet && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
                      <HighlightText text={snippet} keyword={keyword} />
                    </p>
                  )}

                  {/* 底部元信息 */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map(tag => (
                          <span key={tag.name} className="text-teal-600 dark:text-teal-400">
                            <HighlightText text={`#${tag.name}`} keyword={keyword} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
