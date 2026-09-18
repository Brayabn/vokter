# API de VØKTER

- **Local:** `http://localhost:4000/api` (o el `PORT` de `backend/.env`)
- **Producción:** `https://<servicio>.onrender.com/api` (ver README → URLs públicas)

Todas las respuestas son JSON. Los errores controlados tienen la forma `{ "error": "mensaje" }`.

## Salud

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | `{ status: "ok", database: "postgres" \| "sqlite" }`. Verifica la conexión a la BD (503 si falla). Lo usa Render como health check |

## Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | `{ name, email, password, role?, bio?, skills? }` → `201 { token, user }`. Valida email y contraseña (≥ 6) |
| POST | `/auth/login` | No | `{ email, password }` → `{ token, user }` · `401` credenciales inválidas |
| GET | `/auth/me` | Sí | Usuario autenticado · `401` token inválido/expirado |

`/auth/login` y `/auth/register` tienen rate limit: 20 intentos por IP cada 15 minutos.

## Catálogo

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/categories` | No | Categorías ordenadas por nombre |
| GET | `/contents?search=&categorySlug=&sort=rating` | No | Buscar (sin distinguir mayúsculas), filtrar y ordenar |
| GET | `/contents/:id` | No | Detalle con categoría y autor · `404` si no existe o el id no es válido |
| POST | `/contents` | Sí (`expert`) | Crear contenido `{ title, description, categoryId, tags?, imageUrl? }` |
| GET | `/experts?categorySlug=` | No | Expertos (opcionalmente los que publican en esa categoría) |
| GET | `/experts/:id` | No | `{ expert, contents }`: perfil público y sus contenidos |

## Favoritos (requieren token)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/favorites` | Favoritos del usuario (con categoría y autor) |
| POST | `/favorites/:contentId` | Agrega. Idempotente: `201` si se creó, `200` si ya existía |
| DELETE | `/favorites/:contentId` | Quita. Idempotente: `204` |

## VOKTER AI

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/ai/match` | No | `{ query: "texto en lenguaje natural" }` → top 3 expertos con `matchScore` (%) |

## Autenticación

```
Authorization: Bearer <token>
```

JWT firmado con `JWT_SECRET` (HS256), expira según `JWT_EXPIRES_IN` (7 días). Payload: `{ id, role, email }`.

## Usuarios demo (seed)

Contraseña para todos: `vokter123`

- `demo@vokter.com` — usuario
- `laura`, `miguel`, `carlos`, `valentina`, `sofia`, `andres`, `david`, `camila`, `ana`, `julian` `@vokter.com` — expertos

## Verificación automática

```bash
cd backend
npm run smoke -- https://<servicio>.onrender.com/api   # o http://localhost:4000/api
```

Recorre salud, catálogo, auth, favoritos y VOKTER AI (19 comprobaciones) y termina con código ≠ 0 si algo falla.
