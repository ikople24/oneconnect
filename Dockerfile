# Stage 1: Build the frontend application
FROM node:20-slim AS build-stage

# Set environment and working directory
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the application source code
COPY . .

# Build the frontend application (output to frontend-dist)
RUN npm run build -- --out-dir=./frontend-dist

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built files from build-stage
COPY --from=build-stage /usr/src/app/frontend-dist /usr/share/nginx/html

# Expose port for Nginx
EXPOSE 80

# Start Nginx server to serve the app
CMD ["nginx", "-g", "daemon off;"]
