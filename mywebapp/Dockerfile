# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
COPY package.json package-lock.json ./ 
RUN npm ci

# END DEPS IMAGE

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

ARG MAIN_HOST

ARG NEXTAUTH_URL=http://localhost:3000
ARG NEXTAUTH_SECRET=

ARG MONGODB_HOSTNAME
ARG MONGODB_PORT
ARG MONGODB_USERNAME
ARG MONGODB_PASSWORD
ARG MONGODB_DATABASE

ARG MONGODB_URI
ARG MONGODB_CERT

ARG SPACES_KEY
ARG SPACES_SECRET
ARG SPACES_ENDPOINT
ARG SPACES_BUCKET
ARG SPACES_URL

ARG EMAIL_SMTP
ARG EMAIL_PORT
ARG EMAIL_USER
ARG EMAIL_PASSWORD
ARG EMAIL_FROM
ARG EMAIL_NAME

ARG OPENAI_API_KEY
ARG DG_API_KEY
ARG GETIMG_API_KEY

ENV MAIN_HOST=$MAIN_HOST
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

ENV MONGODB_HOSTNAME=$MONGODB_HOSTNAME
ENV MONGODB_PORT=$MONGODB_PORT
ENV MONGODB_USERNAME=$MONGODB_USERNAME
ENV MONGODB_PASSWORD=$MONGODB_PASSWORD
ENV MONGODB_DATABASE=$MONGODB_DATABASE

ENV MONGODB_URI=$MONGODB_URI
ENV MONGODB_CERT=$MONGODB_CERT

ENV SPACES_KEY=$SPACES_KEY
ENV SPACES_SECRET=$SPACES_SECRET
ENV SPACES_ENDPOINT=$SPACES_ENDPOINT
ENV SPACES_BUCKET=$SPACES_BUCKET
ENV SPACES_URL=$SPACES_URL

ENV EMAIL_SMTP=$EMAIL_SMTP
ENV EMAIL_PORT=$EMAIL_PORT
ENV EMAIL_USER=$EMAIL_USER
ENV EMAIL_PASSWORD=$EMAIL_PASSWORD
ENV EMAIL_FROM=$EMAIL_FROM
ENV EMAIL_NAME=$EMAIL_NAME

ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV DG_API_KEY=$DG_API_KEY
ENV GETIMG_API_KEY=$GETIMG_API_KEY

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]

