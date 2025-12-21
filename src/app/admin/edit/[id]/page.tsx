'use client';

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/postService";
import PostForm from "@/components/admin/PostForm";
import { Loader2 } from "lucide-react";
import type { Tag } from '@/types/post';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // 解构并使用 Promise 形式的 params

  const [initialData, setInitialData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. useEffect: 进入页面时获取旧数据
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetching(true);
        const post = await postService.getPostById(id);

        // 格式化数据以适配 PostForm
        setInitialData({
          title: post.title,
          content: post.content,
          tags: post.tags.map((t: Tag) => t.name),
        });
      } catch (error) {
        console.error("获取文章失败:", error);
        alert("文章不存在或获取失败");
        router.push('/');
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [id, router]);

  // 2. 处理更新提交
  const handleUpdate = async (data: { title: string; content: string; tags: string[] }) => {
    try {
      setSubmitting(true);
      await postService.updatePost({ id, data });
      alert("更新成功！");
      router.push(`/posts/${id}`);
      router.refresh(); // 强制刷新 Next.js 缓存，确保详情页看到最新内容
    } catch (error) {
      console.error("更新失败:", error);
      alert("更新失败，请检查网络");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. 加载中状态
  if (fetching) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-gray-500 gap-2">
        <Loader2 className="animate-spin" size={32} />
        <p>正在载入文章内容...</p>
      </div>
    );
  }

  return (
    <PostForm
      initialData={initialData}
      onSubmit={handleUpdate}
      isSubmitting={submitting}
    />
  );
}