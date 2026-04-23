# Deployment Notes

## Local Docker Run

```bash
docker compose up --build
```

This starts the Bun server on `http://localhost:3000` and mounts the local `resumes/` directory read-only into the container.

## Production-Style Docker Run

```bash
docker compose --env-file deploy.env -f docker-compose.prod.yml up -d
```

This variant:

- binds the app to `127.0.0.1:3000`
- enables `TRUST_PROXY=1`
- expects an image-based deploy through `IMAGE_REPOSITORY` and `IMAGE_TAG`
- keeps the restart and log settings intended for a reverse-proxy setup

Example `deploy.env`:

```bash
IMAGE_REPOSITORY=ghcr.io/your-github-owner/resume-site
IMAGE_TAG=latest
```

## Reverse Proxy

If a reverse proxy terminates TLS in front of the app, forward the client IP so rate limiting can distinguish callers correctly.

Recommended forwarded headers:

- `X-Forwarded-For`
- `X-Real-IP`
- `X-Forwarded-Proto`

The app itself only trusts forwarded IP headers when `TRUST_PROXY=1`.

## PDF Requirements

PDF export depends on a Chrome or Chromium executable.

- In Docker, the image installs Alpine Chromium and sets `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`
- Outside Docker, the app tries common Chrome and Chromium paths automatically
- If auto-detection fails, set `PUPPETEER_EXECUTABLE_PATH` yourself

## Health Check

The container health check calls:

```text
GET /api/resume
```

That endpoint is lightweight and works well as a simple readiness probe for the checked-in public resume.

## What the Container Serves

The current container serves these public routes:

- `/`
- `/project/cloud-inference-platform`
- `/experiments`
- `/resume`

It also serves the public JSON/PDF API routes under `/api/*`.

## Recommended Hostinger VPS Process

This repo is set up for:

1. GitHub Actions CI
2. Docker image push to GHCR
3. GitHub Actions SSH deploy to the VPS
4. Docker Compose on the VPS

That is the recommended path for this app because it already ships with a Dockerfile and does not need Kubernetes.

## VPS Bootstrap

1. Provision the Hostinger VPS with Docker installed.
2. Put a reverse proxy with TLS in front of the app.
3. Create the deploy directory:

```bash
sudo mkdir -p /srv/resume-site
sudo chown -R "$USER":"$USER" /srv/resume-site
```

4. Log in to GHCR on the VPS if the package will be private:

```bash
docker login ghcr.io
```

5. Place the production compose file in `/srv/resume-site/`.
6. Create `/srv/resume-site/deploy.env` from `deploy.env.example`.
7. Run the app:

```bash
cd /srv/resume-site
docker compose --env-file deploy.env -f docker-compose.prod.yml pull
docker compose --env-file deploy.env -f docker-compose.prod.yml up -d
```

## GitHub Actions Files

The repo includes:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

`ci.yml` runs `bun run check`.

`deploy.yml`:

- runs `bun run check`
- builds and pushes the Docker image to GHCR
- uploads `docker-compose.prod.yml` to the VPS
- writes `deploy.env` on the VPS with the image tag for that commit
- runs `docker compose pull && docker compose up -d`

## Required GitHub Secrets

Set these in the GitHub repository or `production` environment:

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `TS_OAUTH_CLIENT_ID`
- `TS_AUDIENCE`

The deploy workflow is configured for Tailscale SSH with Tailscale federated identity only.

For this setup:

- set `VPS_HOST` to the VPS's Tailscale hostname or Tailscale IP
- make sure the tailnet policy allows both:
  - network access from `tag:ci` to the VPS on port `22`
  - `ssh` access from `tag:ci` to the VPS as the target Linux user, such as `deploy`

The workflow requires `id-token: write` for this Tailscale federated-identity flow.

Notes:

- `VPS_PORT` can be omitted if your SSH server uses `22`.
- `VPS_SSH_KEY` and `VPS_SSH_KNOWN_HOSTS` are not used by this repo's deploy workflow
- if `VPS_HOST`, `VPS_USER`, `TS_OAUTH_CLIENT_ID`, or `TS_AUDIENCE` is missing, the deploy workflow fails before the image build and push steps

## Optional GHCR Secrets

If the GHCR package is private, also set:

- `GHCR_USERNAME`
- `GHCR_READ_TOKEN`

For a private package, `GHCR_READ_TOKEN` should be a GitHub personal access token with `read:packages`.

If the GHCR package is public, these two secrets are not required.

## Recommended GitHub Variables

Set these as repository or environment variables when available:

- `PRODUCTION_URL`
- `REMOTE_DEBUG_LOGS`

Example:

```text
PRODUCTION_URL=https://tonylee.bio
REMOTE_DEBUG_LOGS=false
```

The deploy workflow uses:

- `PRODUCTION_URL` for an optional public smoke test after the VPS deploy succeeds
- `REMOTE_DEBUG_LOGS=true` only when you intentionally want full remote container logs copied into GitHub Actions output on failures

## First Deploy

1. Push the repo changes.
2. Add the GitHub secrets.
3. Add `PRODUCTION_URL` if you want the workflow to check the public domain after deploy.
4. Run the `deploy` workflow manually or push to `main`.
5. Confirm the health check:

```bash
curl -fsS http://127.0.0.1:3000/api/resume
```

6. Confirm the site through the reverse proxy and domain.

## Rollback

To roll back manually on the VPS:

```bash
cd /srv/resume-site
cat > deploy.env <<'EOF'
IMAGE_REPOSITORY=ghcr.io/your-github-owner/resume-site
IMAGE_TAG=<older-git-sha>
EOF
docker compose --env-file deploy.env -f docker-compose.prod.yml up -d
```
