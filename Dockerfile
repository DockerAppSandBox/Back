FROM node:20.10.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20.10.0-alpine AS runner

RUN chmod -R 755 package.json


WORKDIR /app

COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/package-lock.json package-lock.json

RUN npm ci --frozen-lockfile

RUN cat package.json
RUN ls node_modules
# ENV NODE_ENV=production

# RUN npm cache clean --force

CMD ["npm", "run", "start"]
