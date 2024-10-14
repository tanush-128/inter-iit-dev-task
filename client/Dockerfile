##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app



# Install dependencies 

COPY package.json  package-lock.json*  ./

RUN npm ci

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine AS builder
ARG NEXT_PUBLIC_BACKEND_URL="https://backend.warhosuse.run.place"
ENV NEXT_PUBLIC_BACKEND_URL ${NEXT_PUBLIC_BACKEND_URL}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

RUN SKIP_ENV_VALIDATION=1 npm run build

##### RUNNER

FROM --platform=linux/amd64 gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV BACKEND_URL http

# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["server.js"]
