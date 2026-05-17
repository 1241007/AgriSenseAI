FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

COPY package.json pnpm-workspace.yaml package-lock.json* ./

# Install deps (use npm ci if no pnpm lockfile present)
RUN pnpm install --frozen-lockfile || npm ci

COPY . .

# Build static assets
RUN pnpm build || npm run build

# ── Runtime stage (nginx) ──────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config that handles SPA routing and proxies /api to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
