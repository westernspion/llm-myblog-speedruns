CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO posts (slug, title, excerpt, content, tags, published_at)
VALUES
  (
    'from-pager-fatigue-to-proactive-slos',
    'From Pager Fatigue to Proactive SLOs',
    'How I reduced after-hours alerts by moving a legacy service from threshold monitoring to service-level objectives and error budgets.',
    '# From Pager Fatigue to Proactive SLOs

Moving from threshold alerts to SLO-driven alerts changed the quality of our on-call life.

## What changed

- We defined user-facing SLIs first.
- We set realistic error budgets per service tier.
- We alert only when burn-rate indicates customer impact.

```bash
# Example burn-rate style alert logic
error_ratio_5m > 0.02 and error_ratio_1h > 0.01
```

> Alert volume dropped, while incident quality improved.
',
    ARRAY['SRE', 'Reliability', 'On-Call'],
    NOW() - INTERVAL '14 days'
  ),
  (
    'incident-commander-notes-keeping-cool-at-3am',
    'Incident Commander Notes: Keeping Cool at 3AM',
    'A practical incident command loop for outages: stabilize first, communicate second, and only then chase root causes.',
    '# Incident Commander Notes

When pagers fire at 3AM, calm process beats raw heroics.

## Command loop

1. Stabilize impact first.
2. Communicate status every 15 minutes.
3. Assign and rotate investigators.
4. Capture decisions in a shared timeline.

Use explicit roles and avoid mixing incident command with deep debugging.
',
    ARRAY['Incidents', 'Ops Leadership'],
    NOW() - INTERVAL '7 days'
  ),
  (
    'container-security-baselines-for-small-teams',
    'Container Security Baselines for Small Teams',
    'A lightweight hardening baseline using image scanning, signature verification, and policy checks before deployment.',
    '# Container Security Baselines

Small teams can still enforce meaningful container guardrails.

## Practical baseline

- Scan base images in CI.
- Sign release images.
- Verify signatures at deploy time.
- Block critical CVEs for internet-facing workloads.

Keep controls focused on the highest-risk paths first.
',
    ARRAY['Security', 'Containers', 'DevOps'],
    NOW() - INTERVAL '2 days'
  )
ON CONFLICT DO NOTHING;
