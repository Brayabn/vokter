# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

VØKTER — monorepo de una **tienda multimarca** con tres clientes sobre una misma API:
`backend/` (Node + Express + Sequelize), `frontend/` (React + Vite, web en Vercel) y `mobile/`
(Expo / React Native, APK Android). El núcleo funcional es **VOKTER AI**: una consulta en lenguaje
natural ("busco una chaqueta para la lluvia") se compara con las skills/bio de las marcas y devuelve
un *match score*.

Vocabulario del dominio frente al del código (el modelo de datos no cambió de nombre):
`User` con role `expert` = **marca / vendedor** (`skills` = sus líneas de producto), `Content` =
**artículo** del catálogo, `Favorite` = lista de deseos. Las rutas `/experto/:id` y
`/api/experts` siguen llamándose así.

El código, los comentarios, los mensajes de error y las rutas de la web están **en español**
(`/explorar`, `/favoritos`, `/descarga`, `/registro`). Mantén ese idioma al añadir código.

**Paleta:** negro (`ink`), azul (`azure`), azul claro (`sky`) y blanco (`mist`), definida a la vez en
`frontend/tailwind.config.js`, `frontend/src/index.css` (`:root`) y `mobile/src/theme.js`. Sobre
`azure` el texto va en `mist`; sobre `sky`, en `ink`; el texto de acento sobre fondo oscuro es `sky`
(`azure` no llega a 4.5:1). El rojo (`danger`) está reservado a errores, nunca decorativo.

## Comandos

### Docker (web + API + PostgreSQL, forma recomendada de levantar todo)

```bash
docker compose up --build        # web http://localhost:3000 · API http://localhost:4100/api
docker compose logs -f backend
docker compose down              # conserva el volumen postgres_data
docker compose down -v           # BORRA la base local
WEB_PORT=8080 docker compose up --build   # PowerShell: $env:WEB_PORT=8080; docker compose up --build
```

No requiere `.env`: todos los valores tienen default de desarrollo (ver `.env.example` de la raíz).

### Desarrollo sin Docker

```bash
cd backend  && cp .env.example .env && npm install && npm run dev   # :4000, SQLite, crea tablas + seed
cd frontend && cp .env.example .env && npm install && npm run dev   # :5173
cd mobile   && cp .env.example .env && npm install && npx expo start # EXPO_PUBLIC_API_URL = IP del PC
```

### Verificación

No hay framework de tests unitarios. La verificación es el **smoke test** de la API (20 checks
sobre salud, catálogo, auth, favoritos y VOKTER AI); funciona contra cualquier entorno y sale con
código 1 si algo falla:

```bash
cd backend
npm run smoke -- http://localhost:4000/api
npm run smoke -- http://localhost:4100/api                      # backend de Docker
npm run smoke -- https://vokter-api-2571.onrender.com/api       # producción
```

Para ejecutar un solo check, edita/comenta llamadas en `backend/scripts/smoke-test.js` — no hay
selector por nombre. Si añades endpoints, añade su check ahí.

### Otros

```bash
cd backend && npm run seed          # seed idempotente (no duplica)
cd backend && npm run seed:reset    # borra y recrea tablas — bloqueado en producción
cd frontend && npm run build        # build de Vite (dist/)
docker compose exec database psql -U vokter -d vokter
```

Credenciales demo: `demo@vokter.com` / `vokter123` (y 14 marcas `*@vokter.com` con la misma clave; las 4 del catálogo real están en `utils/catalogData.js`, fotos en `backend/public/catalogo` servidas en `/api/media`).

## Arquitectura

### Flujo general

```
frontend (Vercel)  ─┐
                    ├─ HTTPS + JWT ─▶ backend (Render) ─ TLS ─▶ PostgreSQL (Neon)
mobile APK         ─┘
```

En local con Docker el navegador habla con **nginx en :3000**, que hace `proxy_pass /api →
backend:4100` (`frontend/nginx.conf`); la web se compila con `VITE_API_URL=/api`, por lo que todo es
mismo origen y no hay CORS. PostgreSQL no publica puerto en el host.

### Backend (`backend/src`)

`config/env.js → config/db.js → models/ → controllers/ → routes/` montadas en `server.js`.

- **`config/env.js`** centraliza y **valida** la configuración una sola vez al arrancar (fail-fast):
  en producción el servidor no inicia sin `JWT_SECRET` ≥ 32 chars ni `DATABASE_URL`. Toda lectura de
  `process.env` debe pasar por aquí.
- **`config/db.js`** elige el motor según `DATABASE_URL`: PostgreSQL con TLS si existe, SQLite en
  `backend/data/vokter.sqlite` si no. Los modelos son idénticos en ambos casos, así que **cualquier
  SQL o feature específica de un dialecto tiene que ramificarse** — ejemplo real:
  `contentController.js` usa `Op.iLike` en postgres y `Op.like` en sqlite.
- **Esquema:** `sequelize.sync()` al arrancar (crea tablas faltantes; no altera ni borra). No hay
  migraciones; `database/schema.sql` es solo referencia. Un cambio de esquema destructivo requiere
  introducir migraciones primero.
- **Seed:** `utils/seed.js` + `utils/seedData.js`, idempotente vía `findOrCreate` con claves
  naturales (slug, email, título+autor). Corre en cada arranque si `SEED_DEMO_DATA=true` y nunca
  toca usuarios reales ni favoritos.
- **Modelo de datos:** `User` (role `user` | `expert`, `skills` como CSV `"chaquetas,impermeable"`),
  `Category`, `Content` (pertenece a autor + categoría), `Favorite` (N:M explícita User↔Content).
  Las asociaciones viven solo en `models/index.js`.
- **Auth:** JWT sin estado. `middleware/auth.js` expone `requireAuth` (pone `{id, role, email}` en
  `req.user`) y `requireRole('expert')`.
- **`utils/matchEngine.js`** es VOKTER AI: motor por reglas (normalización, stopwords ES —incluido
  el relleno típico de una consulta de compra—, match exacto o de raíz de 4 letras) deliberadamente
  aislado para poder sustituirlo por un LLM sin tocar el resto — bastaría reemplazar
  `extractKeywords` y `scoreAgainst`.
- **Convenciones de respuesta:** todo error controlado devuelve `{ error: "mensaje en español" }`;
  los clientes dependen de esa forma. Las listas devuelven `{ contents }`, `{ favorites }`,
  `{ categories }`. Los ids de ruta se validan con `utils/params.js#parseId` para responder 404 en
  vez de un 500 de PostgreSQL. `POST /api/favorites/:id` es idempotente (201 la primera vez, 200
  después). `/api/experts` lo sirve `contentController` (`listExperts` / `getExpert`), no un
  controlador propio.
- `server.js` aplica helmet, CORS por lista blanca, `trust proxy: 1` (Render), body de 100 kB,
  rate limit de 20/15 min en login y registro, 404 JSON y un handler de errores que nunca filtra
  stack traces.

### Clientes: `frontend/` y `mobile/` son dos implementaciones del mismo diseño

Los pares `api/client.js`, `api/errors.js`, `hooks/useApiRequest.js`, `hooks/useDebouncedValue.js`,
`context/AuthContext.jsx` y `components/{AiMatchWidget,ContentCard,MatchCard,StateViews}` existen
duplicados a propósito (no hay paquete compartido). **Un cambio de comportamiento en uno casi
siempre debe replicarse en el otro.**

Reglas de resiliencia que ese código implementa y que hay que preservar:

- El cliente axios tiene `timeout: 60000` por el arranque en frío del plan gratuito de Render.
- Un `401` cierra la sesión **solo si la petición llevaba token** (`error.config.headers.Authorization`);
  el 401 de un login fallido y los errores de red nunca cierran sesión. `AuthContext` registra el
  cierre vía `setUnauthorizedHandler`.
- `AuthContext` restaura la sesión desde caché (localStorage en web, SecureStore en móvil) y luego
  revalida con `GET /auth/me`: solo 401/404 invalidan; red caída o 5xx conservan la sesión.
- `useApiRequest` descarta respuestas fuera de orden con un contador de petición, y expone
  `{ data, loading, error, reload }`; las pantallas muestran estados explícitos de carga / error con
  "Reintentar" / vacío (`StateViews`).
- `getErrorMessage` traduce el error de axios a un mensaje en español; parte de `{ error }` del
  backend.

Web: rutas en `App.jsx` con `ProtectedRoute` para `/dashboard` y `/favoritos`; `vercel.json` reescribe
todo a `index.html`. Móvil: `navigation/RootNavigator.jsx` (tabs + stack), tema en `src/theme.js`,
token en SecureStore.

### Variables de entorno

`VITE_*` (web) y `EXPO_PUBLIC_*` (móvil) se **incrustan en el build**, no se leen en runtime: cambiar
una exige recompilar (`npx expo start -c` en móvil; redeploy en Vercel). Ninguna tiene fallback a
localhost a propósito: un build mal configurado debe fallar visiblemente. `frontend/src/config/app.js`
exige que `VITE_APK_URL` sea HTTPS o la descuenta (`APK_URL = null`), porque el botón y el QR de
`/descarga` comparten esa única fuente.

### Despliegue

`render.yaml` (Blueprint de la API; `JWT_SECRET` lo genera Render, `DATABASE_URL` y `CORS_ORIGIN` se
pegan en el panel), Vercel con raíz `frontend/`, `mobile/eas.json` para el APK (perfil `preview` =
APK, `production` = AAB; la URL del API va en `env` de cada perfil). Los Dockerfiles son **solo** para
la demo local: Render usa runtime Node nativo y Vercel el build de Vite. Guía: `docs/deploy.md`.

## Documentación

`README.md` es la referencia principal (instalación, URLs públicas, limitaciones, evidencias).
`docs/architecture.md` (modelo de datos y tabla de decisiones técnicas con alternativas descartadas),
`docs/api.md` (endpoints), `docs/flows.md`, `docs/deploy.md`. Mantenlos sincronizados al cambiar
endpoints, variables o infraestructura.

## Notas al trabajar aquí

- `.gitattributes` fuerza LF en `Dockerfile`, `*.conf`, `*.sh` y `docker-compose.yml`: se ejecutan
  dentro de contenedores Linux desde un clon en Windows.
- Ningún `.env` se versiona; `builds/` (APKs) y `backend/data/*.sqlite` están ignorados.
- La API de producción duerme tras ~15 min: abre `/api/health` antes de una demo o de correr el smoke
  test contra Render.
