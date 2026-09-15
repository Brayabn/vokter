# API de VØKTER

Base URL local: `http://localhost:4000/api`

## Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | `{ name, email, password, role?, bio?, skills? }` → `{ token, user }` |
| POST | `/auth/login` | No | `{ email, password }` → `{ token, user }` |
| GET | `/auth/me` | Sí | Devuelve el usuario autenticado |

## Categorías

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/categories` | No | Lista todas las categorías |

## Contenidos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/contents?search=&categorySlug=&sort=rating` | No | Explorar/buscar/filtrar |
| GET | `/contents/:id` | No | Detalle de un contenido |
| POST | `/contents` | Sí (`expert`) | Crear contenido/servicio |

## Favoritos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/favorites` | Sí | Lista los favoritos del usuario |
| POST | `/favorites/:contentId` | Sí | Marca como favorito |
| DELETE | `/favorites/:contentId` | Sí | Quita de favoritos |

## VOKTER AI

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/ai/match` | No | `{ query: "texto en lenguaje natural" }` → top 3 expertos con `matchScore` |

## Autenticación en requests protegidas

```
Authorization: Bearer <token>
```

## Usuarios demo (tras `npm run seed`)

Password para todos: `vokter123`

- `demo@vokter.com` — role `user`
- `laura@vokter.com` — role `expert`, marketing
- `carlos@vokter.com` — role `expert`, desarrollo
- `sofia@vokter.com` — role `expert`, diseño
- `david@vokter.com` — role `expert`, negocios
