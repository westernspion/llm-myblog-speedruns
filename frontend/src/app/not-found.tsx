import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 text-center">
      <p className="font-mono text-synth-cyan text-6xl font-bold mb-4 text-glow-cyan">404</p>
      <p className="font-mono text-synth-text-muted text-xl mb-2">page not found</p>
      <p className="font-mono text-synth-text-muted/50 text-sm mb-10">
        $ ls -la this-page — No such file or directory
      </p>
      <Link href="/" className="btn-primary">go home</Link>
    </div>
  );
}
