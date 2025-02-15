# Stage 1: Build the frontend application
FROM node:18-alpine AS build-stage

# Set environment and working directory
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy package.json and lock file first (to leverage Docker caching)
COPY package*.json ./

# Accept build arguments
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_BASE_URL

# Set environment variables for Vite build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Install dependencies
RUN npm install --production=false

# Copy the rest of the application files
COPY . .

# Build the frontend application (Vite will use the ENV variables)
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy custom nginx configuration if you have one
COPY .nginx.conf /etc/nginx/nginx.conf

# Copy the built frontend files from the build stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
