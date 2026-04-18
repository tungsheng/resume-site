# Deployment Notes

## Local Docker Run

```bash
docker compose up --build
```

This starts the Bun server on `http://localhost:3000` and mounts the local `resumes/` directory read-only into the container.

## Production-Style Docker Run

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

This variant:

- binds the app to `127.0.0.1:3000`
- enables `TRUST_PROXY=1`
- keeps the restart and log settings intended for a reverse-proxy setup

## Reverse Proxy

If a reverse proxy terminates TLS in front of the app, forward the client IP so rate limiting can distinguish callers correctly.

Recommended forwarded headers:

- `X-Forwarded-For`
- `X-Real-IP`
- `X-Forwarded-Proto`

## PDF Requirements

PDF export depends on a Chrome or Chromium executable.

- In Docker, the image installs Alpine Chromium and sets `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`
- Outside Docker, the app tries common Chrome and Chromium paths automatically
- If auto-detection fails, set `PUPPETEER_EXECUTABLE_PATH` yourself

## Health Check

The container health check calls:

```text
GET /api/resumes
```

That endpoint is lightweight and works well as a simple readiness probe.
