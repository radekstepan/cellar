FROM node:20-alpine

# Install yarn (Corepack is included in node:20-alpine)
RUN corepack enable

WORKDIR /app

# Copy configuration files
COPY package.json turbo.json yarn.lock ./
COPY apps/frontend/package.json apps/frontend/
COPY apps/server/package.json apps/server/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/frontend apps/frontend/
COPY apps/server apps/server/

# Build frontend
RUN yarn build

# Expose port
EXPOSE 3001

# Start the server
WORKDIR /app/apps/server
CMD ["yarn", "start"]
