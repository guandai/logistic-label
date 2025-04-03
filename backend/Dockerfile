# Backend Dockerfile
FROM node:18-alpine AS builder

# Enable Corepack to manage Yarn versions
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY ../../package.json ../../yarn.lock ./
COPY ./package.json ./yarn.lock ./

# Install the correct Yarn version specified in package.json
RUN corepack prepare yarn@4.8.1 --activate

# Install dependencies
RUN yarn install --production --frozen-lockfile

# Copy the backend source code
COPY . .

# Build the backend
RUN yarn workspace @ddlabel/backend build

# Production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY ./package.json ./

# Expose backend port
EXPOSE 5100

# Start the backend
CMD ["node", "dist/server.js"]
