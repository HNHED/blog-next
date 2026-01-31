import { postService } from "@/services/postService";
import HomeContent from "@/components/home/HomeContent";

export default async function Home() {
  const posts = await postService.getAllPosts().catch(() => []);

  return <HomeContent posts={posts} />;
}