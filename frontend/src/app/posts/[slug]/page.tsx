import { notFound } from 'next/navigation';

async function PostPage({ params }: { params: { slug: string } }) {
  let post = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.slug}`,
      { next: { revalidate: 60 } }
    );
    post = await response.json();
  } catch (error) {
    console.error('Failed to fetch post:', error);
  }

  if (!post || post.error) {
    notFound();
  }

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      <header className="mb-12">
        <h1 className="text-5xl font-bold mb-4 neon-glow-pink">{post.title}</h1>
        <div className="flex items-center justify-between text-synthwave-text-secondary text-sm border-b border-synthwave-text-secondary border-opacity-20 pb-4">
          <span>{post.author.name}</span>
          <span>{date}</span>
          <span>{post.viewCount} views</span>
        </div>
      </header>

      {post.excerpt && (
        <p className="text-xl text-synthwave-text-secondary mb-8 italic">
          {post.excerpt}
        </p>
      )}

      <div className="prose prose-invert max-w-none mb-12">
        <div
          className="text-synthwave-text-primary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="border-t border-synthwave-text-secondary border-opacity-20 pt-8">
          <h3 className="text-sm font-semibold text-synthwave-neon-cyan mb-4">Tags</h3>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag: any) => (
              <span
                key={tag.tag.id}
                className="px-3 py-1 text-sm border border-synthwave-neon-purple text-synthwave-neon-purple rounded-full"
              >
                #{tag.tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default PostPage;
