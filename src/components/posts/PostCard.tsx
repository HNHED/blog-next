import Link from "next/link";
import { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group py-6 border-b border-gray-100 last:border-0">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
          <time>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</time>
          <div className="flex gap-2">
            {post.tags.map((t) => (
              <span key={t.name} className="text-blue-500/80 italic">
                #{t.name}
              </span>
            ))}
          </div>
        </div>

        <Link href={`/posts/${post.id}`}>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 leading-relaxed line-clamp-2">
          {post.content.replace(/[#*`]/g, '').slice(0, 150)}...
        </p>
      </div>
    </article>
  );
}