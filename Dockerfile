FROM node:20.10.0-alpine

RUN npm cache clean --force

# Create working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Copy prisma files
COPY prisma ./prisma

COPY . .


# Install dependencies in production mode
RUN npm install

RUN npm run build

# Start the api in dev mode
CMD npm run build-prod
