# === Builder Stage ===
FROM node:18-alpine AS builder
# Enable Corepack and prepare Yarn 4.8.1
RUN npm install -g corepack && \
    corepack enable && \
    corepack prepare yarn@4.8.1 --activate
WORKDIR /app
# Copy the root package files and lockfile.
# This assumes you're building from the project root as context.
COPY package.json yarn.lock ./
# Copy the entire project so that all workspaces are available.
COPY . .
# Install dependencies immutably (using the root yarn.lock).
RUN yarn install
RUN yarn install --immutable --immutable-cache

# Build the backend workspace.
RUN yarn workspace @ddlabel/shared build
RUN yarn workspace @ddlabel/backend build
RUN yarn workspace @ddlabel/frontend build

CMD ["sleep", "infinity"]
