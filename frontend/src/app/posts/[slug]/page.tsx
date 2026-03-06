import { getPost } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getPost(params.slug);
  } catch {
    notFound();
  }

  return (
    <article>
      <Link href="/" className="back-link">
        &larr; back to posts
      </Link>

      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">{formatDate(post.createdAt)}</div>
      </header>

      <div className="post-content">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  );
}
