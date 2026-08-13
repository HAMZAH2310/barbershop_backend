# ---- Stage 1: Build ----
FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY lib ./lib
COPY src ./src
RUN npm run build

RUN npm prune --omit=dev

# ---- Stage 2: Runtime ----
FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/src ./src
COPY --from=builder /app/generated ./generated
COPY package*.json ./
COPY tsconfig.json ./

EXPOSE 3001

CMD ["npm", "start"]