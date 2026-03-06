'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-synthwave-bg2 border-b border-synthwave-text-secondary border-opacity-20">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold neon-glow-pink">
          BS
        </Link>

        <div className="hidden md:flex gap-8">
          <Link href="/" className="hover:text-synthwave-neon-cyan transition-colors">
            Home
          </Link>
          <Link href="/posts" className="hover:text-synthwave-neon-cyan transition-colors">
            Articles
          </Link>
          <Link href="/admin" className="hover:text-synthwave-neon-cyan transition-colors">
            Admin
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 neon-glow-cyan"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-synthwave-bg border-t border-synthwave-text-secondary border-opacity-20">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/posts" onClick={() => setMenuOpen(false)}>
              Articles
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
