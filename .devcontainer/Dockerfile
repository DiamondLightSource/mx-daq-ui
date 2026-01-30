# Base stage with Node.js and pnpm
FROM node:20-bullseye AS base
WORKDIR /workspaces

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@latest

# Developer stage
FROM base AS developer

# Keep container alive for devcontainer exec
CMD ["pnpm", "start"]