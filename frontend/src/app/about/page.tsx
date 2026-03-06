import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Bradley Savoy",
};

export default function AboutPage() {
  return (
    <article>
      <header className="post-header">
        <h1>About</h1>
      </header>

      <div className="post-content">
        <p>
          I&apos;m <strong>Bradley Savoy</strong>, a DevOps/SRE engineer with 15 years of
          experience building and maintaining production infrastructure.
        </p>

        <h2>What I Do</h2>
        <p>
          I specialize in making systems reliable, observable, and easy to operate. My
          day-to-day involves infrastructure as code, container orchestration, CI/CD
          pipelines, and incident response.
        </p>

        <h2>Tech I Work With</h2>
        <ul>
          <li><strong>Containers:</strong> Docker, Kubernetes, ECS</li>
          <li><strong>IaC:</strong> Terraform, Pulumi, CloudFormation</li>
          <li><strong>CI/CD:</strong> GitHub Actions, GitLab CI, Jenkins</li>
          <li><strong>Monitoring:</strong> Prometheus, Grafana, Datadog</li>
          <li><strong>Cloud:</strong> AWS, GCP, Cloudflare</li>
          <li><strong>Languages:</strong> Go, Python, TypeScript, Bash</li>
        </ul>

        <h2>This Blog</h2>
        <p>
          Built with <strong>Next.js</strong> on the frontend,{" "}
          <strong>Fastify + Drizzle ORM</strong> on the backend, and{" "}
          <strong>PostgreSQL</strong> for storage. Everything runs locally via Docker
          Compose and will be exposed through a Cloudflare Tunnel.
        </p>

        <h2>Get In Touch</h2>
        <p>
          You can reach me at{" "}
          <a href="mailto:brad.savoy@gmail.com">brad.savoy@gmail.com</a>.
        </p>
      </div>
    </article>
  );
}
