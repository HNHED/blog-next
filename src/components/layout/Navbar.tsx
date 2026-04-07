"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import { BLOG_OWNER } from './Sidebar';
import { ContributionChart } from "@/components/common/ContributionChart";

// 引入 Floating UI 核心组件
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

export default function Navbar() {
  const t = useTranslations('nav');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // 1. 初始化 Floating UI 状态
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(12), // 距离触发按钮的间距
      flip({ fallbackAxisSideDirection: 'end' }), // 空间不足时自动翻转
      shift({ padding: 10 }), // 关键：碰撞视口边界时自动推回
    ],
    whileElementsMounted: autoUpdate, // 保证滚动或缩放时位置实时更新
  });

  // 2. 配置交互行为
  const click = useClick(context);
  const dismiss = useDismiss(context); // 点击外部关闭
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br flex items-center justify-center shadow-md overflow-hidden">
                <Image
                  src={BLOG_OWNER.avatar}
                  alt="Admin"
                  fill
                  className="rounded-full object-cover border-2 border-gray-200/60 dark:border-gray-700/60 shadow-md"
                  priority
                  sizes="(max-width: 640px) 28px, 40px"
                />
              </div>
            </Link>
          </div>

          {/* Search & Theme Toggle & Language */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Contribution Chart 触发按钮 */}
            <button
              ref={refs.setReference}
              {...getReferenceProps()}
              className={`p-2 rounded-full transition-colors relative ${
                isOpen ? 'bg-gray-100 dark:bg-gray-800 text-teal-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Contribution Activity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>

            {/* Contribution Chart 浮层 - 使用 Portal 渲染在 Body 下，避免层级问题 */}
            {isOpen && (
              <FloatingPortal>
                <FloatingFocusManager context={context} modal={false}>
                  <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="z-[100] outline-none"
                  >
                    <div className="
                      bg-white dark:bg-gray-800 
                      rounded-xl shadow-2xl 
                      border border-gray-200 dark:border-gray-700 
                      overflow-x-auto 
                      custom-scrollbar
                      /* 响应式最大宽度限制：防止在窄屏时超出视口 */
                      w-[92vw] sm:w-auto
                      max-w-[calc(100vw-1.5rem)]
                    ">
                      <div className="p-2 sm:p-4">
                        <div className="min-w-max">
                          <ContributionChart />
                        </div>
                      </div>
                    </div>
                  </div>
                </FloatingFocusManager>
              </FloatingPortal>
            )}

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 px-4 py-2 pl-10 pr-8 bg-gray-100/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
              />
              {/* ... svg search icon ... */}
            </form>

            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}