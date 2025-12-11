# Imagen base
FROM node:24.11-alpine3.21

WORKDIR /usr/src/app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa Vite (5173)
EXPOSE 5173

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]
