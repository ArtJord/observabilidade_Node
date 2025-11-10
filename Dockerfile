
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY src ./src
COPY scripts ./scripts
COPY .env ./.env
COPY sql ./sql

EXPOSE 3000
CMD ["node", "src/server.js"]
