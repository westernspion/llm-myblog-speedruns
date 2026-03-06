import { isAdminAuthenticated } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="page-shell">
      <div className="scan-lines" aria-hidden="true" />
      <section className="admin-card">
        <p className="eyebrow">Admin Access</p>
        <h1>Sign in to manage posts</h1>
        <p className="admin-helper">Use your admin credentials to create, edit, and delete markdown posts.</p>

        {searchParams?.error ? <p className="admin-error">Invalid username or password.</p> : null}

        <form className="admin-form" method="post" action="/api/admin/login">
          <label>
            Username
            <input type="text" name="username" required autoComplete="username" />
          </label>

          <label>
            Password
            <input type="password" name="password" required autoComplete="current-password" />
          </label>

          <button type="submit">Sign in</button>
        </form>

        <Link className="back-link" href="/">
          ← Return to blog
        </Link>
      </section>
    </main>
  );
}
