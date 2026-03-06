import { getPostByPathSegment } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric"
});

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostByPathSegment(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="scan-lines" aria-hidden="true" />

      <article className="post-detail">
        <Link className="back-link" href="/">
          ← Back to latest dispatches
        </Link>
        <p className="post-date">{formatter.format(new Date(post.publishedAt))}</p>
        <h1>{post.title}</h1>
        <p className="post-lead">{post.excerpt}</p>

        <div className="tags">
          {post.tags.map((tag) => (
            <span key={`${post.id}-${tag}`}>{tag}</span>
          ))}
        </div>

        <div className="post-body">
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </div>
      </article>
    </main>
  );
}
