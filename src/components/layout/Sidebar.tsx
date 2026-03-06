"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect } from 'react';

// 博主信息配置
export const BLOG_OWNER = {
  name: process.env.NEXT_PUBLIC_AUTHOR_NAME,
  avatar: process.env.NEXT_PUBLIC_AUTHOR_AVATAR || 'https://avatars.githubusercontent.com/u/54623485?v=4',
  bio: process.env.NEXT_PUBLIC_AUTHOR_BIO,
  signature: process.env.NEXT_PUBLIC_AUTHOR_SIGNATURE,
  github: process.env.NEXT_PUBLIC_AUTHOR_GITHUB,
  leetcode: process.env.NEXT_PUBLIC_AUTHOR_LEETCODE,
  twitter: process.env.NEXT_PUBLIC_AUTHOR_TYPEHERO,
};

interface Category {
  name: string;
  count: number;
  slug: string;
}

interface SidebarProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect?: (slug: string | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
  totalCount?: number;
}

export default function Sidebar({ categories, selectedCategory, onCategorySelect, isOpen, onClose, totalCount }: SidebarProps) {
  const { data: session } = useSession();
  const isAdmin = !!session;
  const t = useTranslations();
  const tNav = useTranslations('nav');
  const tSidebar = useTranslations('sidebar');
  const tCommon = useTranslations('common');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen])

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-14 sm:top-16 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 z-40
          top-14 sm:top-16
          w-72
          h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]
          bg-white/70 dark:bg-gray-900/80
          backdrop-blur-2xl
          border-r border-gray-200/60 dark:border-gray-700/50
          shadow-xl shadow-gray-300/20 dark:shadow-gray-900/40
          p-6 flex flex-col overflow-y-auto no-scrollbar
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Frosted glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white/20 to-cyan-50/40 dark:from-teal-950/20 dark:via-transparent dark:to-cyan-950/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/30 dark:from-gray-800/20 dark:via-transparent dark:to-gray-800/20 pointer-events-none" />

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100/60 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden z-10"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Profile Section - 显示博主信息 */}
        <div className="text-center mb-6 mt-6 lg:mt-0 relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-4">
            (
            <Image
              src={BLOG_OWNER.avatar}
              alt={session?.user?.name || "Admin"}
              fill
              priority
              className="rounded-full object-cover border-2 border-gray-200/60 dark:border-gray-700/60 shadow-md"
            />
            )
            {isAdmin && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" title="管理员在线" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {isAdmin && session?.user?.name ? session.user.name : BLOG_OWNER.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {BLOG_OWNER.bio}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
            "{BLOG_OWNER.signature}"
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3 mb-6 relative z-10">
          <a
            href={BLOG_OWNER.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100/60 dark:bg-gray-800/60 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href={BLOG_OWNER.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100/60 dark:bg-gray-800/60 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200"
            aria-label="LeetCode"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
            </svg>
          </a>
          <a
            href={BLOG_OWNER.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100/60 dark:bg-gray-800/60 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200"
            aria-label="Twitter"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7.5 18.5L2 12L7.5 5.5L8.9 6.9L4.8 12L8.9 17.1L7.5 18.5ZM16.5 18.5L15.1 17.1L19.2 12L15.1 6.9L16.5 5.5L22 12L16.5 18.5ZM13.84 4.3L15.1 4.7L10.16 19.7L8.9 19.3L13.84 4.3Z" />
            </svg>
          </a>
        </div>

        {/* Article Timeline */}
        <Link
          href="/timeline"
          className="flex items-center gap-3 px-4 py-3 mb-5 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group relative z-10 border border-gray-200/40 dark:border-gray-700/40"
        >
          <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {tNav('timeline')}
          </span>
        </Link>

        {/* Categories */}
        <div className="flex-1 relative z-10">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            {tSidebar('categories')}
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onCategorySelect?.(null)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${!selectedCategory
                  ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium border border-teal-200/60 dark:border-teal-800/40"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-500" />
                  {tSidebar('allPosts')}
                </span>
                <span className="text-xs bg-gray-200/80 dark:bg-gray-700/80 px-2 py-0.5 rounded-full">
                  {totalCount ?? categories.reduce((sum, cat) => sum + cat.count, 0)}
                </span>
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <button
                  onClick={() => onCategorySelect?.(category.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${selectedCategory === category.slug
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium border border-teal-200/60 dark:border-teal-800/40"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getCategoryColor(category.slug)}`} />
                    {category.name}
                  </span>
                  <span className="text-xs bg-gray-200/80 dark:bg-gray-700/80 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Section */}
        <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 relative z-10">
          {isAdmin ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {tCommon('loggedIn')}
              </div>
              <button
                onClick={() => signOut()}
                className="w-full px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 rounded-xl transition-all cursor-pointer"
              >
                {tCommon('logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="w-full px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 rounded-xl transition-all cursor-pointer"
            >
              {tSidebar('adminEntry')}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 relative z-10">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            © 2025 {BLOG_OWNER.name}
          </p>
        </div>
      </aside>
    </>
  );
}

function getCategoryColor(slug: string): string {
  const colors: Record<string, string> = {
    python: "bg-yellow-400",
    "machine-learning": "bg-purple-400",
    cloud: "bg-blue-400",
    devops: "bg-orange-400",
    productivity: "bg-green-400",
    javascript: "bg-yellow-500",
    react: "bg-cyan-400",
    backend: "bg-red-400",
  };
  return colors[slug] || "bg-gray-400";
}
