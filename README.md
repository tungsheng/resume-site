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

## Adding a Resume

Create `resumes/your-name.yaml`:

```yaml
header:
  name: Your Name
  badges: [Software Engineer]
  contacts:
    phone: 555-1234
    linkedin: yourname
    email: you@example.com
  summary: Brief professional summary.

experience:
  - title: Senior Developer
    company: Tech Corp
    startDate: "2020"
    endDate: Present
    highlights:
      - Led development of key features

skills:
  frontend: [React, TypeScript]
  backend: [Node.js, PostgreSQL]
  management: [Agile]

education:
  - school: University
    degree: BS Computer Science
    startDate: "2012"
    endDate: "2016"

certificates:
  - title: AWS Certified
    issuer: Amazon
    date: "2023"
```

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
