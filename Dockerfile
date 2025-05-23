FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install 

RUN npm run build

# --- Stage 2: Create the final production-ready image ---
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/package*.json ./

EXPOSE 8080 

CMD ["npm", "run", "start"]
