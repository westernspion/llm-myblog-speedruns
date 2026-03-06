const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number | null;
  tags: { name: string; slug: string }[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API}/api/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`${API}/api/posts/${slug}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export async function getAllPosts(): Promise<Post[]> {
  const res = await fetch(`${API}/api/posts/all`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function createPost(data: {
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  tagNames: string[];
}): Promise<Post> {
  const res = await fetch(`${API}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(
  id: number,
  data: {
    title: string;
    excerpt: string;
    content: string;
    published: boolean;
    tagNames: string[];
  }
): Promise<Post> {
  const res = await fetch(`${API}/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${API}/api/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete post');
}

export async function login(email: string, password: string): Promise<{ token: string; email: string }> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}
