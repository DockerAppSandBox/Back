FROM node:20.10.0-alpine

RUN npm cache clean --force

# Install pnpm

# Create working directory
WORKDIR /app

# Copy package files
COPY package.json ./

COPY . .

# Copy prisma files
COPY prisma ./prisma


# Install dependencies in production mode
RUN npm install

RUN npm run build

RUN rm -rf src/

# Start the api in dev mode
CMD npm run build-prod
