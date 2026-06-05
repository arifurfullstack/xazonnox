# Stage 1: Build the Angular SSR application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist/angular-ui /app/dist/angular-ui
COPY --from=build /app/package*.json /app/
RUN npm ci --only=production --legacy-peer-deps
EXPOSE 4220
ENV PORT=4220
CMD ["node", "dist/angular-ui/server/server.mjs"]
