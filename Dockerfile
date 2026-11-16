FROM node:20

RUN npm install -g pnpm@9.15.4

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @lecercle/db exec prisma generate
RUN pnpm --filter @lecercle/api build

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/main.js"]
