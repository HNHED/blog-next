import { postService } from "@/services/postService";
import PostCard from "@/components/posts/PostCard";

export default async function Home() {
  // 1. 获取数据
  const posts = await postService.getAllPosts().catch(() => []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-16 border-l-4 border-blue-600 pl-6">
        <h1 className="text-4xl font-black text-gray-900">Dev Log</h1>
        <p className="mt-2 text-gray-500 italic">Code, Think and Repeat.</p>
      </header>

      <div className="flex flex-col">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">还没有发布过文章</div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </main>
  );
}