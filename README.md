# VØKTER — Voice of Knowledge

Plataforma que conecta personas con conocimiento, servicios y expertos, con
**VOKTER AI**: un motor de recomendación que interpreta lo que el usuario
necesita en lenguaje natural y lo conecta con el experto más afín.

> Desarrollado como propuesta evolutiva sobre la plataforma de referencia VOKTER,
> reinterpretada como un marketplace de conocimiento en lugar de un e-commerce.

## Estado del proyecto

- [x] **Backend** — Auth (JWT + bcrypt), roles, contenidos, favoritos, categorías, VOKTER AI. **Probado end-to-end.**
- [x] **Frontend web** — Landing, login/registro, dashboard, explorar, detalle, favoritos, VOKTER AI en UI, página de descarga con QR. **Compila sin errores.**
- [ ] App móvil (Expo)
- [ ] Distribución del APK (GitHub Releases + QR)
- [ ] Capturas y documentación final

## Estructura

```
vokter/
├── backend/     → API REST (Node.js + Express + Sequelize) — listo
├── frontend/    → App web (React + Vite + Tailwind) — listo
├── mobile/      → App móvil (Expo) — próximo bloque
├── database/    → schema.sql de referencia
└── docs/        → architecture.md, api.md
```

## Cómo correr el backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed   # crea las tablas y datos demo
npm run dev    # http://localhost:4000
```

## Cómo correr el frontend

En **otra terminal**, con el backend ya corriendo:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev    # http://localhost:5173
```

Abre `http://localhost:5173` en el navegador. Puedes ingresar con la cuenta demo
(`demo@vokter.com` / `vokter123`) o crear una cuenta nueva.

Prueba rápida:

```bash
curl http://localhost:4000/api/health

curl -X POST http://localhost:4000/api/ai/match \
  -H "Content-Type: application/json" \
  -d '{"query":"necesito ayuda con marketing y redes sociales"}'
```

Usuarios demo y detalle de endpoints en [`docs/api.md`](docs/api.md).
Decisiones de arquitectura en [`docs/architecture.md`](docs/architecture.md).

## Stack

- **Backend**: Node.js, Express, Sequelize, SQLite (dev) / MySQL-PostgreSQL (prod), JWT, bcrypt.
- **Frontend**: React + Vite + Tailwind, react-router-dom, axios, qrcode.react.
- **Mobile**: Expo / React Native (en construcción).

## Roadmap del ejercicio (4 días)

1. **Día 1** ✅ Backend + Auth + VOKTER AI.
2. **Día 2** ✅ Frontend: landing, login/register, dashboard, explorar, VOKTER AI en UI, página de descarga.
3. **Día 3** App móvil (Expo) con las mismas pantallas core + build de APK.
4. **Día 4** QR de descarga real, pulido visual, documentación final y capturas.
