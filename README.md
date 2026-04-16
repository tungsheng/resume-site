# Resume Site

A self-hosted resume builder with PDF export and admin portal.

## Quick Start

```bash
bun install
bun run dev
```

Open http://localhost:3000

## URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Resume | http://localhost:3000/resume/tony-lee |
| Admin | http://localhost:3000/admin |

Default login: `admin` / `changeme`

## Validation Commands

```bash
bun run check                # typecheck + unit tests
bun run test:integration     # requires server running on localhost:3000
```

## Adding a Resume

Create `resumes/your-name.yaml`:

```yaml
meta:
  version: 2
  slug: your-name
  updatedAt: "2026-02-17"

profile:
  name: Your Name
  headline:
    - Software Engineer
  contacts:
    phone: 555-1234
    linkedin: yourname
    email: you@example.com
  summary: Brief professional summary.

experience:
  - role: Senior Developer
    company: Tech Corp
    period:
      start: "2020"
      end: Present
    highlights:
      - Led development of key features

projects:
  title: Selected Projects
  items:
    - title: GPU Inference Platform on Kubernetes (EKS + Karpenter + vLLM)
      highlights:
        - Built queue-aware autoscaling using custom serving metrics

skills:
  - category: Frontend
    items: [React, TypeScript]
  - category: Backend
    items: [Node.js, PostgreSQL]
  - category: Management
    items: [Agile]

education:
  - school: University
    degree: BS Computer Science
    period:
      start: "2012"
      end: "2016"

certifications:
  - name: AWS Certified
    issuer: Amazon
    date: "2023"
```

Legacy format (`header`, `title`, `startDate/endDate`, skills as object) is still supported and normalized at load time.

Then visit: http://localhost:3000/resume/your-name

## Docker

```bash
docker compose up --build
```

With custom credentials:
```bash
ADMIN_USERNAME=myuser ADMIN_PASSWORD=secret docker compose up --build
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `DATABASE_PATH` | ./data/resume.db | SQLite database |
| `RESUMES_DIR` | resumes | Resume YAML directory |
| `ADMIN_USERNAME` | admin | Admin username |
| `ADMIN_PASSWORD` | changeme | Admin password |

## Developer Guide

See [DEVELOPER.md](DEVELOPER.md) for:
- Project structure
- Adding components & features
- API endpoints
- Testing
- Docker commands
