'use client';
import PostForm from "@/components/admin/PostForm";
import { postService } from "@/services/postService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setLoading(true);
    try {
      await postService.createPost(data);
      router.push('/');
      router.refresh();
    } catch (e) {
      alert("创建失败");
    } finally {
      setLoading(false);
    }
  };

  return <PostForm onSubmit={handleCreate} isSubmitting={loading} />;
}