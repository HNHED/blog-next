"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Post } from "@/types/post";
import Sidebar from "@/components/layout/Sidebar";
import PostCard from "@/components/posts/PostCard";

interface HomeContentProps {
  posts: Post[];
}

export default function HomeContent({ posts }: HomeContentProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 从文章中提取分类（使用标签作为分类）
  const categories = useMemo(() => {
    const tagCounts: Record<string, { name: string; count: number; slug: string }> = {};

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        const slug = tag.name.toLowerCase().replace(/\s+/g, "-");
        if (tagCounts[slug]) {
          tagCounts[slug].count++;
        } else {
          tagCounts[slug] = {
            name: tag.name,
            count: 1,
            slug,
          };
        }
      });
    });

    return Object.values(tagCounts).sort((a, b) => b.count - a.count);
  }, [posts]);

  // 根据选中的分类筛选文章
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((post) =>
      post.tags.some((tag) => tag.name.toLowerCase().replace(/\s+/g, "-") === selectedCategory)
    );
  }, [posts, selectedCategory]);

  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategory(slug);
    setSidebarOpen(false); // 选择分类后关闭移动端侧边栏
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory ?? undefined}
        onCategorySelect={handleCategorySelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content - extends full width, sidebar overlays on top */}
      <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:pl-80 lg:pr-8 lg:py-8">
        <div className="max-w-4xl mx-auto lg:mx-0">
          {/* Mobile Header with Menu Button */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </button>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
              >
                ✕
              </button>
            )}
          </div>

          {/* Posts List */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {selectedCategory
                  ? `${categories.find((c) => c.slug === selectedCategory)?.name || ""}`
                  : t('latestPosts')}
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline hidden lg:block"
                >
                  ✕
                </button>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 dark:text-gray-500">{tCommon('noData')}</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
