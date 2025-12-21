'use client';

import { Plus, Edit3, Trash2, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { postService } from "@/services/postService";

export default function FloatingActionButton() {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. 判断当前所处页面类型
  const isHomePage = pathname === '/';
  const isPostDetail = pathname.startsWith('/posts/');
  const postId = isPostDetail ? pathname.split('/').pop() : null;

  // 2. 模拟权限（后续对接 Auth）
  const isAdmin = true; 
  if (!isAdmin) return null;

  // 删除逻辑
  const handleDelete = async () => {
    if (confirm("确定要删除这篇文章吗？")) {
      await postService.deletePost(postId!);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
      {/* 只有在详情页才显示的删除按钮 */}
      {isPostDetail && (
        <button
          onClick={handleDelete}
          className="p-4 bg-white text-red-500 border border-red-100 rounded-full shadow-xl hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1 group relative"
        >
          <Trash2 size={24} />
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            删除文章
          </span>
        </button>
      )}

      {/* 主操作按钮：首页跳转新增，详情页跳转编辑 */}
      <Link
        href={isHomePage ? "/admin/new" : `/admin/edit/${postId}`}
        className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all transform hover:-translate-y-1 group relative"
      >
        {isHomePage ? <Plus size={24} /> : <Edit3 size={24} />}
        
        <span className="absolute right-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
          {isHomePage ? "写新文章" : "编辑此文"}
        </span>
      </Link>
    </div>
  );
}