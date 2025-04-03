# Frontend Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY ../../package.json ../../yarn.lock ./
COPY ./package.json ./yarn.lock ./

# Install dependencies
RUN yarn install --production --frozen-lockfile

# Copy the frontend source code
COPY . .

# Build the frontend
RUN yarn workspace @ddlabel/frontend build

# Production image
FROM nginx:alpine

# Copy built frontend files to Nginx
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Expose frontend port
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
