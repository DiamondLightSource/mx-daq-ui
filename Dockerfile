FROM node:22-alpine AS base

# Use a consistent working directory across all stages
WORKDIR /app

# 1) Install dependencies
FROM base AS deps

# If your application uses environment variables for compile-time configuration, you can use arguments
# to configure them when building the image.
# ARG FOO=BAR
# ENV REACT_APP_FOO=${FOO}

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Uncomment the next line if you're not using Classic Yarn
#COPY ./.yarn ./.yarn


# Install dependencies using the detected lockfile
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2) Run the build
FROM base AS builder

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build the app using the detected package manager
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 3) Create minimal image to serve the app
FROM nginxinc/nginx-unprivileged:1.25-alpine as runner

# Copy built files to nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]