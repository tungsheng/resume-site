#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

DOMAIN="${DOMAIN:-tonylee.bio}"
WWW_DOMAIN="${WWW_DOMAIN:-www.tonylee.bio}"
EMAIL="${EMAIL:-}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
APP_DIR="${APP_DIR:-/srv/resume-site}"
APP_PORT="${APP_PORT:-3000}"
ADD_SWAP_MB="${ADD_SWAP_MB:-2048}"
IMAGE_REPOSITORY="${IMAGE_REPOSITORY:-ghcr.io/your-github-owner/resume-site}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

if [[ $EUID -ne 0 ]]; then
  echo "Run as root:"
  echo "  sudo bash $0"
  exit 1
fi

if [[ ! -r /etc/os-release ]]; then
  echo "Cannot detect OS: /etc/os-release missing"
  exit 1
fi

. /etc/os-release
OS_ID="${ID:-debian}"
OS_CODENAME="${VERSION_CODENAME:-}"
ARCH="$(dpkg --print-architecture)"

case "${OS_ID}" in
  debian)
    DOCKER_DISTRO="debian"
    ;;
  ubuntu)
    DOCKER_DISTRO="ubuntu"
    ;;
  *)
    echo "Unsupported distro for this script: ${OS_ID}"
    echo "Supported: debian, ubuntu"
    exit 1
    ;;
esac

echo "==> detected OS: ${OS_ID} ${OS_CODENAME}"

cleanup_stale_docker_repo_config() {
  echo "==> clean stale Docker apt repo config"

  rm -f /etc/apt/sources.list.d/docker.list

  if [[ -d /etc/apt/sources.list.d ]]; then
    while IFS= read -r -d '' file; do
      rm -f "${file}"
    done < <(grep -RIlZ 'download\.docker\.com/linux/ubuntu' /etc/apt/sources.list.d || true)
  fi

  if [[ "${DOCKER_DISTRO}" == "debian" && -d /etc/apt/sources.list.d ]]; then
    while IFS= read -r -d '' file; do
      rm -f "${file}"
    done < <(grep -RIlZ 'download\.docker\.com/linux/ubuntu' /etc/apt/ /etc/apt/sources.list.d 2>/dev/null || true)
  fi
}

cleanup_stale_docker_repo_config

echo "==> update system packages"
apt update
apt upgrade -y

echo "==> install base packages"
apt install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  ufw \
  git \
  jq \
  unzip \
  debian-keyring \
  debian-archive-keyring \
  apt-transport-https

if ! id "${DEPLOY_USER}" >/dev/null 2>&1; then
  echo "==> create deploy user: ${DEPLOY_USER}"
  adduser --disabled-password --gecos "" "${DEPLOY_USER}"
  usermod -aG sudo "${DEPLOY_USER}"
else
  echo "==> deploy user already exists: ${DEPLOY_USER}"
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "==> install Docker for ${DOCKER_DISTRO}"
  install -m 0755 -d /etc/apt/keyrings

  curl -fsSL "https://download.docker.com/linux/${DOCKER_DISTRO}/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  cat >/etc/apt/sources.list.d/docker.list <<EOF
deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${DOCKER_DISTRO} ${OS_CODENAME} stable
EOF

  apt update
  apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
else
  echo "==> Docker already installed"

  # Keep the apt repo correct for future reruns and upgrades even when Docker already exists.
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/${DOCKER_DISTRO}/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  cat >/etc/apt/sources.list.d/docker.list <<EOF
deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${DOCKER_DISTRO} ${OS_CODENAME} stable
EOF
fi

echo "==> add ${DEPLOY_USER} to docker group"
usermod -aG docker "${DEPLOY_USER}" || true

if ! swapon --show | grep -q .; then
  echo "==> create ${ADD_SWAP_MB}MB swap"
  fallocate -l "${ADD_SWAP_MB}M" /swapfile || dd if=/dev/zero of=/swapfile bs=1M count="${ADD_SWAP_MB}"
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
else
  echo "==> swap already exists"
fi

echo "==> configure firewall"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable

if ! command -v caddy >/dev/null 2>&1; then
  echo "==> install Caddy"
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  chmod o+r /etc/apt/sources.list.d/caddy-stable.list
  apt update
  apt install -y caddy
else
  echo "==> Caddy already installed"
fi

echo "==> write Caddyfile"
if [[ -n "${EMAIL}" ]]; then
  cat >/etc/caddy/Caddyfile <<EOF
{
  email ${EMAIL}
}

${DOMAIN} {
  encode gzip zstd
  reverse_proxy 127.0.0.1:${APP_PORT}
}

${WWW_DOMAIN} {
  redir https://${DOMAIN}{uri} permanent
}
EOF
else
  cat >/etc/caddy/Caddyfile <<EOF
${DOMAIN} {
  encode gzip zstd
  reverse_proxy 127.0.0.1:${APP_PORT}
}

${WWW_DOMAIN} {
  redir https://${DOMAIN}{uri} permanent
}
EOF
fi

echo "==> validate Caddy config"
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

echo "==> enable and start Caddy"
systemctl enable --now caddy
systemctl reload caddy

echo "==> create app directory"
mkdir -p "${APP_DIR}"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}"

echo "==> write deploy.env"
cat > "${APP_DIR}/deploy.env" <<EOF
IMAGE_REPOSITORY=${IMAGE_REPOSITORY}
IMAGE_TAG=${IMAGE_TAG}
EOF
chown "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}/deploy.env"
chmod 600 "${APP_DIR}/deploy.env"

echo
echo "==> bootstrap complete"
echo
echo "Next steps:"
echo "1. Log in as ${DEPLOY_USER} again so docker group membership applies."
echo "2. Put docker-compose.prod.yml into ${APP_DIR}/"
echo "3. If GHCR is private, run:"
echo "     docker login ghcr.io"
echo "4. Start the app:"
echo "     cd ${APP_DIR}"
echo "     docker compose --env-file deploy.env -f docker-compose.prod.yml pull"
echo "     docker compose --env-file deploy.env -f docker-compose.prod.yml up -d"
echo
echo "Verification:"
echo "  curl -fsS http://127.0.0.1:${APP_PORT}/api/resume"
echo "  curl -I https://${DOMAIN}"
echo
echo "Logs:"
echo "  sudo journalctl -u caddy -f"
echo "  cd ${APP_DIR} && docker compose --env-file deploy.env -f docker-compose.prod.yml logs -f"
