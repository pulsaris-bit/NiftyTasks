# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install system dependencies for better-sqlite3 build if needed
# RUN apt-get update && apt-get install -y python3 make g++ 

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Create data directory for SQLite persistence
RUN mkdir -p /app/data

# Re-install prod dependencies to ensure native modules like better-sqlite3 match the OS
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts .
# For production, we usually use the compiled server, but node 20+ can run TS type-stripping 
# or we use tsx. In production we might prefer compiling server.ts to server.js
# For simplicity here we assume the runtime environment has tsx or we use node on a compiled file.
# The environment constraints say node supports type stripping natively.

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.ts"]
