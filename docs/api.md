# API de VØKTER

- **Local:** `http://localhost:4000/api` (o el `PORT` de `backend/.env`)
- **Producción:** `https://vokter-api-2571.onrender.com/api` (Render + Neon PostgreSQL)

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
| POST | `/contents` | Sí (`expert`) | Crear artículo `{ title, description, categoryId, tags?, imageUrl?, price? }` · `imageUrl` solo `https://` o `/api/media/...`; `price` entero en COP |
| GET | `/media/catalogo/NN.jpg` | No | Fotos del catálogo (estáticas, `Cross-Origin-Resource-Policy: cross-origin`, caché 7 días) |
| GET | `/experts?categorySlug=` | No | Marcas (opcionalmente las que tienen artículos en esa categoría) |
| GET | `/experts/:id` | No | `{ expert, contents }`: página de la marca y sus artículos |

## Favoritos (requieren token)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/favorites` | Favoritos del usuario (con categoría y autor) |
| POST | `/favorites/:contentId` | Agrega. Idempotente: `201` si se creó, `200` si ya existía |
| DELETE | `/favorites/:contentId` | Quita. Idempotente: `204` |

## VOKTER AI

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/ai/match` | No | `{ query: "texto en lenguaje natural" }` → top 3 marcas con `matchScore` (%) |

## Autenticación

```
Authorization: Bearer <token>
```

JWT firmado con `JWT_SECRET` (HS256), expira según `JWT_EXPIRES_IN` (7 días). Payload: `{ id, role, email }`.

## Usuarios demo (seed)

Contraseña para todos: `vokter123`

- `demo@vokter.com` — usuario
- `nord`, `atlas`, `solsticio`, `kuro`, `vantage`, `casatierra`, `meridian`, `fjord`, `lumen`, `base` `@vokter.com` — marcas demo
- `gold`, `starhome`, `urbansport`, `pasofirme` `@vokter.com` — marcas del catálogo real (`backend/src/utils/catalogData.js`)

Los artículos traen `price` (COP, `null` = precio a consultar) e `imageUrl` relativo a la API (`/api/media/...`); los clientes lo resuelven contra el origen de `VITE_API_URL` / `EXPO_PUBLIC_API_URL`.

## Seguridad

- Rate limit general de 1000 peticiones / 15 min por IP en `/api`, y 20 / 15 min en login y registro.
- Validación de tipos y longitudes en auth, búsqueda, VOKTER AI y creación de artículos (un body con objetos devuelve `400`, no `500`).
- Login con comparación bcrypt de tiempo constante aunque el correo no exista (no permite enumerar cuentas).
- La web envía CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` y `Permissions-Policy` (`vercel.json` y `nginx.conf`).

## Verificación automática

```bash
cd backend
npm run smoke -- https://<servicio>.onrender.com/api   # o http://localhost:4000/api
```

Recorre salud, catálogo, auth, favoritos y VOKTER AI (19 comprobaciones) y termina con código ≠ 0 si algo falla.
