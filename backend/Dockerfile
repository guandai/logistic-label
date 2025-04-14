# === Production Stage ===
FROM node:18-alpine

WORKDIR /app

RUN npm install -g corepack && \
    corepack enable && \
    corepack prepare yarn@4.8.1 --activate

# Copy the built backend output and runtime dependencies.
# Adjust the paths if your build places files elsewhere.
COPY --from=ddlabel-builder /app/backend/dist ./backend/dist
COPY --from=ddlabel-builder /app/node_modules ./node_modules
COPY --from=ddlabel-builder /app/backend/package.json ./backend/package.json

COPY --from=ddlabel-builder /app/shared ./shared

RUN mkdir -p /app/uploads /app/download
ENV NODE_PATH=/app/shared/dist
EXPOSE 5100

WORKDIR /app/backend
# Start the backend application.
# CMD ["sleep", "infinity"]
CMD ["node", "dist/server.js"]
