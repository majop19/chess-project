# ---------- STAGE 1: build ----------
FROM node:20 AS builder

# Définit le répertoire de travail
WORKDIR /app

COPY package*.json ./

COPY pnpm-lock.yaml ./

# Installe les dépendances (dev incl.)
RUN npm ci

# Copie le reste du projet
COPY . .

# Build : typescript server + vite client

# compile server (tsc) build le client (vite build)
RUN npm run build

# ---------- STAGE 2: production ----------
FROM node:20-slim AS runner

# Crée un user non-root pour la sécurité
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/public ./public

EXPOSE 3000

# Change ownership of the app directory
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Healthcheck optionnel (facultatif)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -f http://localhost:3000/health || exit 1

# Commande de démarrage (doit correspondre à ton package.json "start")
CMD ["npm", "run", "start"]
