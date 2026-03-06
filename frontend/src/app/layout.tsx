import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bradley Savoy — DevOps & SRE Blog",
  description: "Infrastructure, containers, CI/CD, monitoring, and war stories from 15 years in the trenches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="site-title">
              bradley savoy
            </Link>
            <nav className="site-nav">
              <Link href="/">Blog</Link>
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>

        <main>
          <div className="container">{children}</div>
        </main>

        <footer className="site-footer">
          <div className="container">
            <span>&copy; {new Date().getFullYear()} Bradley Savoy</span>
            <span>Built with Next.js, Fastify &amp; PostgreSQL</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
