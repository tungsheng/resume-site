FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1-alpine AS release
WORKDIR /app

# Install Chromium (Alpine package is smaller than Debian)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    curl

ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -S appuser && adduser -S -G appuser -h /app appuser

COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./
COPY public ./public
COPY src ./src
COPY resumes ./resumes

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/resumes || exit 1

CMD ["bun", "run", "src/index.ts"]
