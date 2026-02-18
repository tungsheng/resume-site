# Developer Guide

## Setup

```bash
bun install
bun run dev
```

Open http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start with hot reload |
| `bun run start` | Production start |
| `bun run test:unit` | Run unit tests |
| `bun run test:integration` | Run integration tests (requires running server) |
| `bun run check` | Type check + unit tests |
| `bun run typecheck` | Type check |

## Project Structure

```
src/
  domain/             # Shared domain logic
    resume/           # Resume normalization + rendering
  server/             # HTTP route modules + response helpers
  features/           # Pages (React)
    home/             # Landing page
    resume/           # Public resume view
    admin/            # Admin dashboard
  components/         # Shared React components
  hooks/              # React hooks & utilities
  services/           # Backend facades and infra services
  styles/             # Shared styles
  routes.ts           # Route facade
  index.ts            # Server entry
```

## Tech Stack

- **Runtime**: Bun
- **Frontend**: React 19
- **Database**: SQLite (bun:sqlite)
- **PDF**: Puppeteer + Chromium

---

## Docker

### Build & Run

```bash
docker compose up --build
```

### Custom Credentials

```bash
ADMIN_USERNAME=myuser ADMIN_PASSWORD=secret docker compose up --build
```

### Using .env File

Create `.env`:
```
ADMIN_USERNAME=myuser
ADMIN_PASSWORD=secret
```

Then:
```bash
docker compose up --build
```

### Rebuild After Changes

```bash
docker compose up --build --force-recreate
```

### View Logs

```bash
docker compose logs -f
```

### Stop

```bash
docker compose down
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/resumes` | No | List all resumes |
| GET | `/api/resume/:name` | No | Get resume data |
| GET | `/api/settings/:name` | No | Get theme settings |
| POST | `/api/settings/:name` | Yes | Save theme settings |
| POST | `/api/login` | No | Admin login |
| POST | `/api/logout` | No | Admin logout |
| GET | `/api/session` | No | Check auth status |
| POST | `/api/export-pdf` | Yes | Export PDF (admin) |
| POST | `/api/public-pdf` | No | Download PDF (public) |

---

## Adding Code

### New Component

1. Create folder:
```
src/components/my-component/
  index.tsx    # Component code
  style.ts     # Styles (optional)
```

2. Export from `src/components/index.ts`:
```ts
export { MyComponent } from "./my-component";
```

3. Use:
```tsx
import { MyComponent } from "../../components";
```

### New Feature (Page)

1. Create folder:
```
src/features/my-feature/
  index.tsx    # Page + React mount
  style.ts     # Styles
```

2. Create `public/my-feature.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Feature</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { height: 100%; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="../src/features/my-feature/index.tsx"></script>
</body>
</html>
```

3. Add route in `src/index.ts`:
```ts
import myFeaturePage from "../public/my-feature.html";

Bun.serve({
  routes: {
    "/my-feature": myFeaturePage,
  }
});
```

### New API Endpoint

Add handler in `src/routes.ts`:
```ts
export async function handleMyEndpoint(req: Request): Promise<Response> {
  return Response.json({ message: "Hello" });
}
```

Add route in `src/index.ts`:
```ts
routes: {
  "/api/my-endpoint": { GET: handleMyEndpoint },
}
```

---

## Testing

```bash
bun run test:unit
bun run test:integration
bun run check
```

---

## Security

| Feature | Implementation |
|---------|----------------|
| CSRF | Token validated on POST requests |
| XSS | Input escaped via `escapeHtml()` |
| Rate Limiting | 5 login attempts/minute |
| Path Traversal | Names sanitized via `sanitizeName()` |
| Headers | X-Frame-Options, CSP, etc. |

---

## Production Deployment

### Using docker-compose.prod.yml

```bash
# Create .env with required credentials
echo "ADMIN_USERNAME=myuser" >> .env
echo "ADMIN_PASSWORD=securepassword123" >> .env

# Deploy
docker compose -f docker-compose.prod.yml up -d --build
```

### Production vs Development

| Feature | Development | Production |
|---------|-------------|------------|
| Config file | `docker-compose.yml` | `docker-compose.prod.yml` |
| NODE_ENV | not set | `production` |
| Secure cookies | No | Yes |
| Port binding | `0.0.0.0:3000` | `127.0.0.1:3000` |
| Credentials | Optional defaults | Required |
| Restart policy | `unless-stopped` | `always` |
| Resource limits | None | 1G RAM, 1 CPU |
| Log rotation | None | 10MB, 3 files |

### Reverse Proxy (Nginx)

Production binds to `127.0.0.1:3000`. Use a reverse proxy for HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name resume.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Backup Database

```bash
# Copy from Docker volume
docker compose -f docker-compose.prod.yml exec app cat /app/data/resume.db > backup.db

# Or use volume path
docker cp $(docker compose -f docker-compose.prod.yml ps -q app):/app/data/resume.db backup.db
```

### Update Deployment

```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Environment Variables

| Variable | Default | Required (Prod) | Description |
|----------|---------|-----------------|-------------|
| `NODE_ENV` | - | Yes | Set to `production` |
| `PORT` | 3000 | No | Server port |
| `DATABASE_PATH` | ./data/resume.db | No | SQLite database |
| `RESUMES_DIR` | resumes | No | Resume YAML directory |
| `ADMIN_USERNAME` | admin | Yes | Admin username |
| `ADMIN_PASSWORD` | changeme | Yes | Admin password |
