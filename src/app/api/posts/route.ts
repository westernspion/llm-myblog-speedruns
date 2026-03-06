import { getRecentPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getRecentPosts();
  return Response.json({ posts });
}
