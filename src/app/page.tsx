import { getRecentPosts } from "@/lib/posts";
import Link from "next/link";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

export default async function HomePage() {
  const posts = await getRecentPosts();

  return (
    <main className="page-shell">
      <div className="scan-lines" aria-hidden="true" />

      <header className="hero">
        <p className="eyebrow">Bradley Savoy</p>
        <h1>DevOps and SRE notes from the edge of production.</h1>
        <p>
          Fifteen years of hard-earned lessons on on-call sanity, resilient architecture,
          incident response, and practical platform engineering.
        </p>
        <a className="admin-link-inline" href="/admin/login">
          Admin login
        </a>
      </header>

      <section className="panel">
        <h2>Latest dispatches</h2>

        {posts.length === 0 ? (
          <p className="empty-state">
            No posts are available yet. Start the database service and seed data will appear
            here.
          </p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id} className="post-card">
                <p className="post-date">{formatter.format(new Date(post.publishedAt))}</p>
                <h3>
                  <Link className="post-link" href={`/posts/${post.id}-${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p>{post.excerpt}</p>
                <div className="tags">
                  {post.tags.map((tag) => (
                    <span key={`${post.id}-${tag}`}>{tag}</span>
                  ))}
                </div>
                <Link className="read-more-link" href={`/posts/${post.id}-${post.slug}`}>
                  Read dispatch
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
