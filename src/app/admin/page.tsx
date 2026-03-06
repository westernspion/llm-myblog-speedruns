import { isAdminAuthenticated } from "@/lib/auth";
import { getAllPostsForAdmin } from "@/lib/posts";
import Link from "next/link";
import { redirect } from "next/navigation";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

export default async function AdminDashboardPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const posts = await getAllPostsForAdmin();

  return (
    <main className="page-shell">
      <div className="scan-lines" aria-hidden="true" />
      <section className="admin-card">
        <div className="admin-header-row">
          <div>
            <p className="eyebrow">Admin Console</p>
            <h1>Manage blog posts</h1>
          </div>
          <div className="admin-actions">
            <Link className="admin-button" href="/admin/posts/new">
              New post
            </Link>
            <form method="post" action="/api/admin/logout">
              <button type="submit" className="admin-button ghost">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <ul className="admin-post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <div>
                <p className="post-date">{formatter.format(new Date(post.publishedAt))}</p>
                <h2>{post.title}</h2>
              </div>

              <div className="admin-actions">
                <Link className="admin-link" href={`/posts/${post.id}-${post.slug}`}>
                  View
                </Link>
                <Link className="admin-link" href={`/admin/posts/${post.id}/edit`}>
                  Edit
                </Link>
                <form method="post" action="/api/admin/posts/delete">
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="danger-link">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
