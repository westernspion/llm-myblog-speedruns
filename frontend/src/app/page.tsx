import Link from 'next/link';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';

export const revalidate = 60;

export default async function HomePage() {
  let posts = [];
  try {
    posts = await getPosts();
  } catch {}

  const recent = posts.slice(0, 3);

  return (
    <div className="synth-grid min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-glow-cyan opacity-30 blur-3xl pointer-events-none" />
          <div className="absolute -top-8 right-0 w-64 h-64 bg-glow-magenta opacity-20 blur-3xl pointer-events-none" />

          <p className="font-mono text-synth-cyan text-sm tracking-widest mb-4 text-glow-cyan">
            $ whoami
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-synth-text-primary mb-6 leading-tight">
            Bradley{' '}
            <span className="text-synth-cyan text-glow-cyan">Savoy</span>
          </h1>
          <p className="text-xl text-synth-text-muted max-w-2xl leading-relaxed mb-3">
            DevOps & SRE engineer with 15 years of building infrastructure that actually holds up under pressure.
          </p>
          <p className="text-synth-text-muted/70 max-w-2xl leading-relaxed mb-10">
            I write about Kubernetes, observability, Terraform, incident response, and the culture of reliability. No fluff — just what I've seen work in production.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/blog" className="btn-primary">
              read the blog
            </Link>
            <Link href="/about" className="btn-ghost">
              about me
            </Link>
          </div>

          {/* Terminal prompt decoration */}
          <div className="mt-16 font-mono text-xs text-synth-text-muted/40 space-y-1">
            <div><span className="text-synth-cyan/50">$</span> uptime — 15 years in production</div>
            <div><span className="text-synth-cyan/50">$</span> kubectl get skills — kubernetes, terraform, prometheus, sre</div>
            <div><span className="text-synth-cyan/50">$</span> cat /etc/expertise — platform-engineering, observability, incident-mgmt</div>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      {recent.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-mono text-synth-cyan text-lg tracking-wide">
              <span className="text-synth-text-muted/50">// </span>recent posts
            </h2>
            <Link href="/blog" className="font-mono text-xs text-synth-text-muted hover:text-synth-cyan transition-colors">
              view all →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
