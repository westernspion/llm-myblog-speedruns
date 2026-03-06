'use client';

import Link from 'next/link';

interface BlogCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string;
    viewCount: number;
    author: {
      name: string;
    };
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="card cursor-pointer group">
        <h3 className="text-2xl font-bold mb-2 group-hover:text-synthwave-neon-cyan transition-colors">
          {post.title}
        </h3>
        <p className="text-synthwave-text-secondary text-sm mb-4">
          {post.author.name} • {date}
        </p>
        <p className="text-synthwave-text-secondary mb-4 line-clamp-2">
          {post.excerpt || 'No excerpt provided'}
        </p>
        <div className="flex items-center justify-between text-xs text-synthwave-text-secondary">
          <span>{post.viewCount} views</span>
          <span className="text-synthwave-neon-pink group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </article>
    </Link>
  );
}
