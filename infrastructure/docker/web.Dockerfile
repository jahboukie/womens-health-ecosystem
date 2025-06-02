# Dockerfile for Web Apps
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY web/soberpal-web/package*.json ./
RUN npm ci

# Copy source code
COPY web/soberpal-web .
COPY shared ./shared

# Build the app
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
