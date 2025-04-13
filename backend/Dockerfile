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

# Build the shared workspace first
RUN yarn workspace @ddlabel/shared build

# Build the backend workspace.
RUN yarn workspace @ddlabel/backend build

# === Production Stage ===
FROM node:18-alpine

WORKDIR /app

# Copy the built backend output and runtime dependencies.
# Adjust the paths if your build places files elsewhere.
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./backend/package.json

RUN mkdir -p /app/uploads /app/download


# Optionally, copy the built shared package if needed.
# This assumes your shared build outputs to /app/shared/dist.
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared ./shared

# (Optional) Use NODE_PATH so that require('@ddlabel/shared') resolves to the built module.
ENV NODE_PATH=/app/shared/dist


# Expose the port which your backend uses (e.g., 5100)
EXPOSE 5100

# Start the backend application.
CMD ["node", "backend/dist/server.js"]
