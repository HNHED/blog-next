import Link from "next/link";
import { Post } from "@/types/post";
import CoverPreview from "@/components/cover/CoverPreview";

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const readingTime = Math.ceil(post.content.length / 500);
  const firstTag = post.tags[0]?.name;

  return (
    <section className="mb-6 sm:mb-10">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
        Featured Post
      </h2>
      <Link href={`/posts/${post.id}`}>
        <article className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
          <div className="flex flex-col sm:flex-row">
            {/* Thumbnail - 使用封面预览 */}
            <div className="relative w-full sm:w-48 md:w-64 lg:w-72 h-40 sm:h-auto flex-shrink-0">
              <CoverPreview
                title={post.title}
                tag={firstTag}
                coverConfig={post.coverConfig}
                className="w-full h-full min-h-[160px]"
                width={600}
                height={400}
                fontScale={1.35}
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="px-2.5 py-1 sm:px-3 bg-white/90 dark:bg-gray-900/90 text-teal-600 dark:text-teal-400 text-xs font-semibold rounded-full">
                  Featured
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2 sm:mb-3 line-clamp-2">
                {post.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3 sm:mb-4 hidden sm:block">
                {post.content.replace(/[#*`\[\]]/g, "").slice(0, 200)}...
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-500">
                <time className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime} min
                </span>
                {post.tags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {post.tags[0].name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </Link>
    </section>
  );
}
