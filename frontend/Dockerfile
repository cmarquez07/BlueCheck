# Imagen base
FROM node:24.11-alpine

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos del proyecto al contenedor
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa Vite (5173)
EXPOSE 5173

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]
