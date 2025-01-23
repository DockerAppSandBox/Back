FROM node:20.10.0-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY prisma ./prisma

COPY . .

RUN npm run build

RUN rm -rf node_modules

FROM node:20.10.0-alpine AS runner

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=builder /app/package-lock.json package-lock.json
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/prisma /app/prisma

ENV NODE_ENV=production

RUN npm ci --frozen-lockfile 
RUN npm cache clean --force

EXPOSE 3000

CMD ["node", "build-prod"]
