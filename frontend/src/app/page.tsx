import Link from "next/link";
import { getPosts } from "@/lib/api";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      <section className="hero">
        <h1>Bradley Savoy</h1>
        <p>DevOps & SRE engineer. 15 years of keeping things running.</p>
        <p className="tagline">infrastructure // containers // observability</p>
      </section>

      <section className="post-list">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <div className="post-meta">{formatDate(post.createdAt)}</div>
            <p className="post-excerpt">{post.excerpt}</p>
          </article>
        ))}

        {posts.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
            No posts yet. Check back soon.
          </p>
        )}
      </section>
    </>
  );
}
