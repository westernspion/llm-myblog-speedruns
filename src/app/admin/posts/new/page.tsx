import { isAdminAuthenticated } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function NewPostPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  return (
    <main className="page-shell">
      <div className="scan-lines" aria-hidden="true" />
      <section className="admin-card">
        <p className="eyebrow">Admin Console</p>
        <h1>Create post</h1>

        <form method="post" action="/api/admin/posts/create" className="admin-form">
          <label>
            Title
            <input type="text" name="title" required />
          </label>

          <label>
            Excerpt
            <textarea name="excerpt" rows={3} />
          </label>

          <label>
            Tags (comma separated)
            <input type="text" name="tags" placeholder="SRE, Kubernetes, Incident Response" />
          </label>

          <label>
            Markdown content
            <textarea name="content" rows={16} required />
          </label>

          <div className="admin-actions">
            <button type="submit" className="admin-button">
              Publish post
            </button>
            <Link className="admin-link" href="/admin">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
