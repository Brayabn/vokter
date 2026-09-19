# Web de VØKTER para la instalación local con Docker (multi-stage).
# Producción (Vercel) no usa este archivo: Vercel compila con Vite directamente.

# ---- 1. Build con Node ----
FROM node:22-alpine AS build
WORKDIR /app

# Capa cacheable: solo se reinstala si cambian las dependencias.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite incrusta estas variables AL COMPILAR.
# /api = mismo origen: nginx (etapa 2) reenvía /api al contenedor backend,
# así el navegador nunca necesita resolver el nombre interno "backend".
ARG VITE_API_URL=/api
ARG VITE_APK_URL=https://github.com/Brayabn/vokter/releases/download/v1.0.0/VOKTER-Android-v1.0.0.apk
ARG VITE_APK_VERSION=1.0.0
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APK_URL=$VITE_APK_URL \
    VITE_APK_VERSION=$VITE_APK_VERSION

RUN npm run build

# ---- 2. Servidor estático (nginx) ----
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
