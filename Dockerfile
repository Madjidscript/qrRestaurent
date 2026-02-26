# Image de base : Node.js version 22 sur Alpine (Linux ultra léger)
FROM node:22-alpine

# Installer les outils pour compiler les librairies natives (comme bcrypt)
RUN apk add --no-cache python3 make g++

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json en premier
COPY package*.json ./

# Utiliser le mirror npm de Taobao plus stable
RUN npm config set registry https://registry.npmmirror.com

# Installer les dépendances
RUN npm install

# Copier tous les fichiers
COPY . .

EXPOSE 7000
CMD ["node", "./bin/www"]