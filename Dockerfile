FROM node:20.10.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --frozen-lockfile 

COPY prisma ./prisma

COPY . .


RUN npx prisma generate

RUN npm i --save-dev @types/cors @types/compression @types/express @types/node

RUN npm run build

FROM node:20.10.0-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/prisma .


RUN npm install 

# ENV NODE_ENV=production

# RUN npm cache clean --force

CMD ["npm", "run", "start"]
