# Build stage
FROM node:20.18.0-alpine AS build
WORKDIR /usr/src/build
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# Production image
FROM node:20.18.0-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/build/dist ./dist
COPY --from=build /usr/src/build/package*.json ./
RUN npm install --omit=dev
EXPOSE 6969
CMD ["node", "dist/server.js"]
