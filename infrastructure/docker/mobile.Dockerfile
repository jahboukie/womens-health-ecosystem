# Dockerfile for Mobile Apps
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY mobile/package*.json ./
RUN npm ci

# Copy source code
COPY mobile .
COPY shared ./shared

# Expose Expo ports
EXPOSE 19000 19001

CMD ["npm", "start"]
