# Imagen base LTS
FROM node:24.11-alpine3.21

WORKDIR /app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install

COPY . .
# Copiar código fuente

EXPOSE 3000
CMD ["npm", "run", "start"]
