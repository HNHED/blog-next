"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { postService } from "@/services/postService";

export default function AdminFloatingButton() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // 游客不显示任何按钮
  if (!session) return null;

  const isHomePage = pathname === "/";
  const isPostDetail = pathname.startsWith("/posts/");
  const postId = isPostDetail ? pathname.split("/").pop() : null;

  // 仅在首页和文章详情页显示
  if (!isHomePage && !isPostDetail) return null;

  const handleDelete = async () => {
    if (!postId) return;
    if (confirm("确定要删除这篇文章吗？")) {
      await postService.deletePost(postId);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 flex flex-col gap-3 z-50">
      {/* 删除按钮 - 仅在文章详情页显示 */}
      {isPostDetail && (
        <button
          onClick={handleDelete}
          className="p-3 sm:p-4 bg-white dark:bg-gray-800 text-red-500 border border-red-100 dark:border-red-900/30 rounded-full shadow-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all transform hover:-translate-y-1 group"
          title="删除文章"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}

      {/* 主操作按钮 */}
      <Link
        href={isHomePage ? "/admin/new" : `/admin/edit/${postId}`}
        className="p-3 sm:p-4 bg-teal-500 dark:bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-600 dark:hover:bg-teal-500 transition-all transform hover:-translate-y-1 group"
        title={isHomePage ? "写新文章" : "编辑此文"}
      >
        {isHomePage ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )}
      </Link>
    </div>
  );
}
