FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# tsc only compiles .ts files — copy SQL migrations and seeds into dist/
RUN mkdir -p dist/db/migrations dist/db/seeds && \
    cp -r db/migrations/. dist/db/migrations/ && \
    cp -r db/seeds/. dist/db/seeds/

EXPOSE 3000

CMD ["node", "dist/app.js"]
