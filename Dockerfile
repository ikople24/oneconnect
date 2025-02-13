# Stage 1: Build the application
FROM node:20-slim AS build-stage

# Set environment and working directory
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install dependencies only
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built files from the build-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose port for Nginx
EXPOSE 80

# Start Nginx server to serve the app
CMD ["nginx", "-g", "daemon off;"]
