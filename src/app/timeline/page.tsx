import { postService } from "@/services/postService";
import TimelineContent from "@/components/timeline/TimelineContent";

export const metadata = {
  title: "Timeline - Article Archive",
  description: "Browse all articles by timeline",
};

export default async function TimelinePage() {
  const posts = await postService.getAllPosts().catch(() => []);

  return <TimelineContent posts={posts} />;
}
