import { isAdminAuthenticated } from "@/lib/auth";
import { getPostById } from "@/lib/posts";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type EditPostPageProps = {
  params: {
    id: string;
  };
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    notFound();
  }

  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="scan-lines" aria-hidden="true" />
      <section className="admin-card">
        <p className="eyebrow">Admin Console</p>
        <h1>Edit post</h1>

        <form method="post" action="/api/admin/posts/update" className="admin-form">
          <input type="hidden" name="id" value={post.id} />

          <label>
            Title
            <input type="text" name="title" required defaultValue={post.title} />
          </label>

          <label>
            Excerpt
            <textarea name="excerpt" rows={3} defaultValue={post.excerpt} />
          </label>

          <label>
            Tags (comma separated)
            <input type="text" name="tags" defaultValue={post.tags.join(", ")} />
          </label>

          <label>
            Markdown content
            <textarea name="content" rows={16} required defaultValue={post.content} />
          </label>

          <div className="admin-actions">
            <button type="submit" className="admin-button">
              Save changes
            </button>
            <Link className="admin-link" href="/admin">
              Back
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
