# Stage 1: Build Angular app
FROM node:18-alpine AS build
WORKDIR /app

# Copy dependency files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code and build for production
COPY . .
RUN npx ng build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from build stage
# Angular 17 with application builder outputs to dist/<project-name>/browser
COPY --from=build /app/dist/s2-atw/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
