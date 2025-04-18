# === Production Stage ===
FROM node:18-alpine

WORKDIR /app

RUN npm install -g corepack && \
    corepack enable && \
    corepack prepare yarn@4.8.1 --activate

# Copy the built frontend output and runtime dependencies.
# Adjust the paths if your build places files elsewhere.
COPY --from=ddlabel-builder /app/frontend/dist ./frontend/dist
COPY --from=ddlabel-builder /app/node_modules ./node_modules
COPY --from=ddlabel-builder /app/frontend/package.json ./frontend/package.json
COPY --from=ddlabel-builder /app/shared ./shared
COPY package.json ./
RUN mkdir -p /app/uploads /app/download
ENV NODE_PATH=/app/shared/dist
EXPOSE 5100

WORKDIR /app/frontend
RUN yarn install
RUN yarn install --frozen-lockfile

# Start the frontend application.
# CMD ["sleep", "infinity"]
CMD ["yarn", "serve"]
