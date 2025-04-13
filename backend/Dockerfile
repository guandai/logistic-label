# filepath: backend/Dockerfile
FROM node:18-alpine

# Enable Corepack
RUN npm install -g corepack
RUN corepack enable

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Set the Yarn version
RUN corepack prepare yarn@4.8.1 --activate

# Install dependencies
RUN yarn install --frozen-lockfile

CMD ["node", "-v"]
