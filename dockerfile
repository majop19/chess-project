# ---------- STAGE 1: build ----------
FROM node:20 AS builder

# Définit le répertoire de travail
WORKDIR /app

# Copie package.json et lockfile (vite/tsconfig/... peuvent être mis après si tu veux cache)
COPY package*.json ./
# Si tu utilises pnpm, copy pnpm-lock.yaml etc.
# COPY pnpm-lock.yaml ./

# Installe les dépendances (dev incl.)
RUN npm ci

# Copie le reste du projet
COPY . .

# Build : typescript server + vite client
# Assure-toi d'avoir un script "build" qui compile server (tsc) et build le client (vite build)
RUN npm run build

# ---------- STAGE 2: production ----------
FROM node:20-slim AS runner

# Crée un user non-root pour la sécurité
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

# Copie seulement ce dont on a besoin pour exécuter l'app
COPY package*.json ./
# COPY pnpm-lock.yaml ./

# Installe uniquement les dépendances de production
RUN npm ci --omit=dev

# Copie les fichiers buildés depuis le builder
COPY --from=builder /app/dist ./dist
# Si tu sers des assets statiques ou fichiers publics:
COPY --from=builder /app/public ./public
# Si tu as des fichiers .env.example ou scripts nécessaires:
# COPY --from=builder /app/prisma ./prisma

# Expose le port que ton app utilise (Railway utilisera la variable PORT)
EXPOSE 3000

# Change owner du contenu
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Healthcheck optionnel (facultatif)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -f http://localhost:3000/health || exit 1

# Commande de démarrage (doit correspondre à ton package.json "start")
CMD ["npm", "run", "start"]
