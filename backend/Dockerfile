# API de VØKTER (Node + Express). Imagen usada por docker-compose.yml para la
# instalación local. Producción (Render) no usa esta imagen: ver render.yaml.
FROM node:22-alpine

WORKDIR /app

# 1) Solo los manifiestos: esta capa (y la instalación) se reutiliza mientras
#    las dependencias no cambien.
COPY package.json package-lock.json ./

# Dependencias de producción. --omit=optional excluye sqlite3 (solo se usa en
# desarrollo sin Docker); aquí la base de datos es PostgreSQL vía DATABASE_URL.
RUN npm ci --omit=dev --omit=optional && npm cache clean --force

# 2) Solo el código necesario para ejecutar la API.
COPY src ./src
COPY scripts ./scripts

# No ejecutar como root (el usuario "node" viene en la imagen oficial).
USER node

ENV PORT=4100
EXPOSE 4100

CMD ["node", "src/server.js"]
