'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const path = usePathname();

  const links = [
    { href: '/', label: 'home' },
    { href: '/blog', label: 'blog' },
    { href: '/about', label: 'about' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-synth-border bg-synth-bg/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-synth-cyan text-glow-cyan font-semibold text-lg tracking-wider">
          <span className="text-synth-magenta">~/</span>bradley.savoy
        </Link>
        <nav className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-mono text-sm tracking-wide transition-all duration-200 ${
                path === href
                  ? 'text-synth-cyan text-glow-cyan'
                  : 'text-synth-text-muted hover:text-synth-cyan'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="font-mono text-xs text-synth-text-muted hover:text-synth-magenta transition-colors border border-synth-border hover:border-synth-magenta/40 px-3 py-1.5 rounded"
          >
            admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
