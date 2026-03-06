import { getPost, getPosts } from '@/lib/api';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getPost(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        className="font-mono text-xs text-synth-text-muted hover:text-synth-cyan transition-colors mb-8 inline-block"
      >
        ← back to blog
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag.slug} className="synth-tag">{tag.name}</span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-synth-text-primary leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4">
          <time className="font-mono text-sm text-synth-text-muted/60">
            {formatDate(post.publishedAt)}
          </time>
          <span className="text-synth-text-muted/30">·</span>
          <span className="font-mono text-sm text-synth-text-muted/60">Bradley Savoy</span>
        </div>
        <p className="mt-4 text-synth-text-muted leading-relaxed text-lg border-l-2 border-synth-purple pl-4">
          {post.excerpt}
        </p>
      </header>

      <div className="prose-synthwave">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-synth-border">
        <Link
          href="/blog"
          className="font-mono text-xs text-synth-cyan hover:text-synth-magenta transition-colors"
        >
          ← more posts
        </Link>
      </div>
    </div>
  );
}
