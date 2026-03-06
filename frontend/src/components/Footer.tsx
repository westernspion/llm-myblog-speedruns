export default function Footer() {
  return (
    <footer className="border-t border-synth-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-synth-text-muted text-sm">
          <span className="text-synth-cyan">©</span> {new Date().getFullYear()} Bradley Savoy
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/bsavoy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-synth-text-muted hover:text-synth-cyan transition-colors"
          >
            github
          </a>
          <a
            href="https://linkedin.com/in/bradleysavoy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-synth-text-muted hover:text-synth-cyan transition-colors"
          >
            linkedin
          </a>
          <a
            href="mailto:brad.savoy@gmail.com"
            className="font-mono text-sm text-synth-text-muted hover:text-synth-cyan transition-colors"
          >
            email
          </a>
        </div>
        <p className="font-mono text-xs text-synth-text-muted/50">
          built with next.js + postgres
        </p>
      </div>
    </footer>
  );
}
