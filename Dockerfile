# Stage 1: Build TypeScript
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run production build
# FROM node:20

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/docs ./docs

EXPOSE 8080
CMD ["npm", "start"]
