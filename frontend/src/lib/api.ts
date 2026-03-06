export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = typeof window === "undefined"
  ? (process.env.INTERNAL_API_URL || "http://localhost:4000")
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}
