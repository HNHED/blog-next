"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Post } from "@/types/post";
import { TagWithCount } from "@/services/tagService";
import { postService } from "@/services/postService";
import Sidebar from "@/components/layout/Sidebar";
import PostCard from "@/components/posts/PostCard";

const PAGE_SIZE = 10;

interface HomeContentProps {
  initialPosts: Post[];
  total: number;
  // tags: TagWithCount[];
  categories: { name: string; count: number; slug: string }[];
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function HomeContent({ initialPosts, total, categories }: HomeContentProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(total);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);


  const fetchPosts = useCallback(async (page: number, tag?: string | null) => {
    setLoading(true);
    try {
      const data = await postService.getPosts({
        page,
        limit: PAGE_SIZE,
        tag: tag || undefined,
      });
      setPosts(data.data);
      setTotalCount(data.total);
      setCurrentPage(page);
    } catch {
      // keep existing state on error
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategory(slug);
    setSidebarOpen(false);
    fetchPosts(1, slug);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchPosts(page, selectedCategory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory ?? undefined}
        onCategorySelect={handleCategorySelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalCount={totalCount}
      />

      <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:pl-80 lg:pr-8 lg:py-8">
        <div className="max-w-4xl mx-auto lg:mx-0">
          {/* Hanging cloud trigger - mobile only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed z-40 lg:hidden group cursor-pointer top-14 sm:top-16 left-[30px] sm:left-[40px] -translate-x-1/2"
          >
            <div className={`flex flex-col items-center transition-all duration-500 ease-in-out ${sidebarOpen ? "" : "animate-swing"}`}>
              <div className={`w-[1px] bg-gradient-to-b from-gray-200/60 dark:from-gray-600/40 to-gray-300/40 dark:to-gray-500/30 transition-all duration-500 ease-in-out ${sidebarOpen ? "h-12" : "h-6"}`} />
              <div className="relative -mt-[1px] group-active:scale-90 transition-transform">
                <Image
                  src="/cloud.webp"
                  alt="Menu"
                  width={36}
                  height={36}
                  priority
                  className="drop-shadow-md group-hover:drop-shadow-lg transition-all"
                />
              </div>
            </div>
          </button>

          {/* Category clear - mobile */}
          {selectedCategory && (
            <div className="flex justify-end mb-4 lg:hidden">
              <button
                onClick={() => handleCategorySelect(null)}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
              >
                ✕
              </button>
            </div>
          )}

          {/* Posts List */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {selectedCategory
                  ? `${categories.find((c) => c.slug === selectedCategory)?.name || ""}`
                  : t("latestPosts")}
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline hidden lg:block"
                >
                  ✕
                </button>
              )}
            </div>

            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-gray-400 dark:text-gray-500">{tCommon("noData")}</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex justify-center items-center gap-1.5 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                {getPageNumbers(currentPage, totalPages).map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-gray-400 dark:text-gray-500">
                      ···
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-teal-500 text-white border border-teal-500"
                          : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      } cursor-pointer`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  ›
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
