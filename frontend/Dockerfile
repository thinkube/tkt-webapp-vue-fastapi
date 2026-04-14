# Build stage - use optimized base from library
ARG CONTAINER_REGISTRY
FROM ${CONTAINER_REGISTRY}/library/node:24-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage - minimal image for serving built files
FROM ${CONTAINER_REGISTRY}/library/nginx:stable-alpine as runtime-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
