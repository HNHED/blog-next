import Link from "next/link";
import { Post } from "@/types/post";

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const readingTime = Math.ceil(post.content.length / 500);

  return (
    <Link href={`/posts/${post.id}`}>
      <article
        className="group flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 mb-4"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Thumbnail */}
        <div className="relative w-full sm:w-28 md:w-32 h-32 sm:h-20 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-teal-400 to-cyan-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2 sm:line-clamp-1 mb-1 text-base sm:text-sm md:text-base">
            {post.title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 hidden sm:block">
            {post.content.replace(/[#*`\[\]]/g, "").slice(0, 100)}...
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 dark:text-gray-500">
            <time>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{readingTime} min read</span>
            {post.tags.length > 0 && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-teal-600 dark:text-teal-400">{post.tags[0].name}</span>
              </>
            )}
          </div>
        </div>

        {/* Arrow - Hidden on mobile */}
        <div className="hidden sm:flex items-center">
          <svg
            className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 group-hover:translate-x-1 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </Link>
  );
}