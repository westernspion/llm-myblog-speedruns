export default function AboutPage() {
  const skills = [
    { category: 'Orchestration', items: ['Kubernetes', 'Helm', 'Argo CD', 'Argo Rollouts'] },
    { category: 'Infrastructure', items: ['Terraform', 'Pulumi', 'Ansible', 'AWS', 'GCP'] },
    { category: 'Observability', items: ['Prometheus', 'Grafana', 'Loki', 'Tempo', 'PagerDuty'] },
    { category: 'CI/CD', items: ['GitHub Actions', 'Jenkins', 'Tekton', 'ArgoCD'] },
    { category: 'Databases', items: ['PostgreSQL', 'MySQL', 'Redis', 'Cassandra'] },
    { category: 'Networking', items: ['Istio', 'Envoy', 'Cloudflare', 'nginx', 'Traefik'] },
  ];

  const timeline = [
    { year: '2024–now', role: 'Staff SRE', org: 'Independent / Consulting', detail: 'Platform engineering, SRE consulting for scaling teams.' },
    { year: '2019–2024', role: 'Senior SRE', org: 'Series B Startup', detail: 'Built platform team from 2 to 8 engineers. Led migration to k8s, implemented GitOps.' },
    { year: '2015–2019', role: 'DevOps Engineer', org: 'Mid-size SaaS', detail: 'Owned all things CI/CD, monitoring, and on-call. Cut MTTR from 2hrs to 12min.' },
    { year: '2009–2015', role: 'Systems Engineer', org: 'Enterprise', detail: 'Linux, networking, virtualization. Where the foundation was built.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="font-mono text-synth-cyan text-sm tracking-widest mb-3 text-glow-cyan">
          $ cat /home/bradley/about.md
        </p>
        <h1 className="text-4xl font-bold text-synth-text-primary mb-4">About</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-synth-text-muted leading-relaxed mb-4">
            I'm Bradley Savoy — a DevOps and SRE engineer with 15 years of experience making distributed systems boring in the best possible way.
          </p>
          <p className="text-synth-text-muted leading-relaxed mb-4">
            I've been on the bleeding edge of infrastructure evolution: from bare metal to VMs, from VMs to containers, from containers to Kubernetes at scale. I've been paged at 3am more times than I can count, and I've built the systems that make those pages stop happening.
          </p>
          <p className="text-synth-text-muted leading-relaxed mb-4">
            These days I focus on platform engineering — building the internal infrastructure that lets product engineers ship faster without shooting themselves in the foot.
          </p>
          <p className="text-synth-text-muted leading-relaxed">
            This blog is where I share the lessons that didn't come from documentation.
          </p>
        </div>

        <div className="space-y-4">
          <div className="synth-card p-4">
            <div className="font-mono text-xs text-synth-text-muted mb-1">specialization</div>
            <div className="text-synth-cyan font-semibold">Platform Engineering & SRE</div>
          </div>
          <div className="synth-card p-4">
            <div className="font-mono text-xs text-synth-text-muted mb-1">experience</div>
            <div className="text-synth-text-primary font-semibold">15 years</div>
          </div>
          <div className="synth-card p-4">
            <div className="font-mono text-xs text-synth-text-muted mb-1">contact</div>
            <a href="mailto:brad.savoy@gmail.com" className="text-synth-cyan hover:text-synth-magenta transition-colors font-mono text-sm">
              brad.savoy@gmail.com
            </a>
          </div>
          <div className="synth-card p-4">
            <div className="font-mono text-xs text-synth-text-muted mb-1">currently</div>
            <div className="text-synth-green font-mono text-sm">open to contract work</div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <section className="mb-16">
        <h2 className="font-mono text-synth-cyan text-lg mb-6">
          <span className="text-synth-text-muted/50">// </span>skills &amp; tools
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(({ category, items }) => (
            <div key={category} className="synth-card p-4">
              <div className="font-mono text-xs text-synth-magenta mb-3 tracking-wide">{category}</div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="text-xs font-mono text-synth-text-muted bg-synth-bg px-2 py-1 rounded border border-synth-border">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="font-mono text-synth-cyan text-lg mb-6">
          <span className="text-synth-text-muted/50">// </span>experience
        </h2>
        <div className="space-y-6">
          {timeline.map(({ year, role, org, detail }) => (
            <div key={year} className="flex gap-6 group">
              <div className="font-mono text-xs text-synth-text-muted/50 w-28 flex-shrink-0 pt-1">{year}</div>
              <div className="flex-1 border-l border-synth-border pl-6 pb-6 relative">
                <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-synth-cyan bg-synth-bg group-hover:bg-synth-cyan transition-colors" />
                <div className="font-semibold text-synth-text-primary mb-0.5">{role}</div>
                <div className="font-mono text-xs text-synth-cyan mb-2">{org}</div>
                <div className="text-sm text-synth-text-muted leading-relaxed">{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
