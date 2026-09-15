# Arquitectura de VØKTER

## Visión general

```
        FRONTEND (React + Vite)          MOBILE (Expo / React Native)
                    │                              │
                    └──────────────┬───────────────┘
                                   │  REST API (JSON + JWT)
                                   ▼
                        BACKEND (Node.js + Express)
                    ┌──────────────┼──────────────┐
                    │              │              │
               Auth (JWT,     Content API    VOKTER AI
               bcrypt)        (contenidos,   (matching por
                               categorías,    keywords)
                               favoritos)
                    │              │
                    └──────┬───────┘
                           ▼
                  SQLite (dev) / MySQL o PostgreSQL (producción)
                  vía Sequelize ORM
```

## Decisiones técnicas y por qué

- **SQLite en desarrollo, vía Sequelize**: permite que cualquier evaluador clone
  el repo y lo ejecute con `npm install` sin instalar ni configurar un motor de
  base de datos aparte. Migrar a MySQL/PostgreSQL en producción solo requiere
  cambiar el `dialect` en `backend/src/config/db.js`; los modelos y controladores
  no cambian.
- **JWT + bcrypt**: autenticación sin estado en el servidor, estándar de la
  industria. Los tokens llevan `id`, `role` y `email` para autorizar sin
  consultar la base de datos en cada request.
- **Roles simples (`user` / `expert`)**: solo dos roles para no sobre-ingenierizar
  un sistema de permisos que la prueba no exige, pero manteniendo el patrón de
  middleware (`requireRole`) extensible a más roles.
- **VOKTER AI basado en reglas + keywords**, no un LLM externo: es transparente,
  no depende de una API key ni de costos externos, y es fácil de explicar y
  defender en la sustentación técnica. Está aislado en `utils/matchEngine.js`
  para poder reemplazarlo por una llamada a un modelo real sin tocar el resto
  del sistema.
- **Monorepo** (`backend/`, `frontend/`, `mobile/`, `database/`, `docs/`):
  separación clara de responsabilidades, cada parte con su propio
  `package.json` y ciclo de vida independiente.

## Flujo de datos típico (VOKTER AI)

1. El usuario escribe una necesidad en lenguaje natural en el frontend.
2. El frontend envía `POST /api/ai/match { query }`.
3. El backend extrae palabras clave relevantes (quitando conectores) y las
   compara contra los `skills`/`bio` de los expertos registrados.
4. Devuelve un top 3 con porcentaje de afinidad (`matchScore`), listo para
   renderizarse como tarjetas de recomendación.

## Seguridad implementada

- Contraseñas nunca se guardan en texto plano (bcrypt, 10 salt rounds).
- Rutas protegidas con middleware `requireAuth` (verifica JWT) y `requireRole`
  (autorización por rol).
- CORS restringido por variable de entorno (`CORS_ORIGIN`).
- Variables sensibles fuera del código (`.env`, con `.env.example` documentado).
- Manejo centralizado de errores en Express (no se filtran stack traces al cliente).
