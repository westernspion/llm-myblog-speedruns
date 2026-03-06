import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';

export const revalidate = 60;

export default async function BlogPage() {
  let posts = [];
  try {
    posts = await getPosts();
  } catch {}

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="font-mono text-synth-cyan text-sm tracking-widest mb-3 text-glow-cyan">
          $ ls -la ./posts
        </p>
        <h1 className="text-4xl font-bold text-synth-text-primary mb-3">
          The Blog
        </h1>
        <p className="text-synth-text-muted max-w-xl">
          War stories, patterns, and pragmatic takes on DevOps and SRE from 15 years in the trenches.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-synth-text-muted font-mono">
          <p className="text-synth-cyan mb-2">$ cat posts/*</p>
          <p className="text-sm">No posts yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
