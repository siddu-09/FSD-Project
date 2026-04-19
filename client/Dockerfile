# ── Build stage — compile the Vite/React app ─────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Accept the backend URL as a build-time arg (injected by Railway)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runtime stage — serve with Nginx ─────────────────────────────────
FROM nginx:stable-alpine AS runner

# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config — handle SPA client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
