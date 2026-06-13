FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY docker-start.sh ./
RUN chmod +x docker-start.sh
EXPOSE 3001
CMD ["sh", "docker-start.sh"]
