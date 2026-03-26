# 1. Usamos una imagen de Node.js liviana (versión 20)
FROM node:20-slim

# 2. Creamos una carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos el package.json y package-lock.json primero
# Esto se hace para que Docker cachee las dependencias y no las reinstale si el código cambia
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos todo el resto del código de nuestra carpeta actual a /app
COPY . .

# 6. Exponemos el puerto que usa nuestra app (el 8080 según tu app.js)
EXPOSE 8080

# 7. Comando para arrancar la aplicación
CMD ["npm", "start"]