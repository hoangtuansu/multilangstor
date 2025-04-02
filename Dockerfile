FROM node:23-alpine AS build

RUN npm --no-update-notifier --no-fund --global install pnpm@10.4.0

RUN pnpm --version

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
