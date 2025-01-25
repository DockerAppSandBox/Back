FROM node:20.10.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY prisma ./prisma

COPY . .


RUN npx prisma generate

RUN npm i --save-dev @types/cors @types/compression @types/express @types/node

RUN npm run build

FROM node:20.10.0-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/package-lock.json package-lock.json
COPY --from=builder /app/public public


RUN npm install 

RUN cat package.json

# ENV NODE_ENV=production

# RUN npm cache clean --force

CMD ["npm", "run", "start"]
