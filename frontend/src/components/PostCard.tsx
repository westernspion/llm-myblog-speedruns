import Link from 'next/link';
import { Post } from '@/lib/api';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="synth-card p-6 group">
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.map((tag) => (
          <span key={tag.slug} className="synth-tag">{tag.name}</span>
        ))}
      </div>
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-xl font-semibold text-synth-text-primary group-hover:text-synth-cyan transition-colors mb-2 leading-snug">
          {post.title}
        </h2>
      </Link>
      <p className="text-synth-text-muted text-sm leading-relaxed mb-4">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <time className="font-mono text-xs text-synth-text-muted/60">
          {formatDate(post.publishedAt)}
        </time>
        <Link
          href={`/blog/${post.slug}`}
          className="font-mono text-xs text-synth-cyan hover:text-synth-magenta transition-colors"
        >
          read more →
        </Link>
      </div>
    </article>
  );
}
