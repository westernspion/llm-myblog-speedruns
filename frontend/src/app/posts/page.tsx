import BlogCard from '@/components/BlogCard';

async function PostsPage() {
  let posts = [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      next: { revalidate: 60 }
    });
    posts = await response.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-4 neon-glow-cyan">Articles</h1>
      <p className="text-synthwave-text-secondary mb-12">
        Explore articles on DevOps, SRE practices, infrastructure, and cloud technologies.
      </p>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-synthwave-text-secondary text-lg">No articles published yet.</p>
        </div>
      )}
    </div>
  );
}

export default PostsPage;
