import { postService } from "@/services/postService";
import { tagService } from "@/services/tagService";
import HomeContent from "@/components/home/HomeContent";

export const revalidate = 3600;

export default async function Home() {
  console.time("fetchData");
  const [postsData, tags] = await Promise.all([
    postService.getPosts({ page: 1, limit: 10 }).catch(() => ({ data: [], total: 0, page: 1, limit: 10 })),
    tagService.getAllTags().catch(() => []),
  ]);
  console.timeEnd("fetchData");

  const processedCategories = tags
    .map((tag) => ({
      name: tag.name,
      count: tag.postCount,
      slug: tag.name.toLowerCase().replace(/\s+/g, "-"),
    }))
    .sort((a, b) => b.count - a.count);

  return <HomeContent initialPosts={postsData.data} total={postsData.total} categories={processedCategories} />;
}
