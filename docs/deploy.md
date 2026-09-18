# Despliegue de VØKTER

Orden recomendado: **Neon → Render (API) → EAS (APK) → GitHub Release → Vercel (web) → CORS**.
Ningún secreto se guarda en el repositorio: todos se definen en el panel de cada plataforma.

## 1. Base de datos — Neon (PostgreSQL)

1. Crear un proyecto en <https://neon.tech> (plan gratuito).
2. Copiar la *connection string* (incluye `sslmode=require`):
   `postgresql://USUARIO:CLAVE@HOST.neon.tech/neondb?sslmode=require`
3. No hay que crear tablas a mano: el backend las crea al arrancar (`sequelize.sync()`) y carga los
   datos demo si `SEED_DEMO_DATA=true` (idempotente).

## 2. API — Render

El servicio está descrito como código en [`render.yaml`](../render.yaml) (Blueprint):
raíz `backend/`, `npm ci`, `npm start`, health check `/api/health`, Node 20, plan gratuito.

1. <https://render.com> → **New → Blueprint** → seleccionar el repositorio.
2. Completar las variables que Render pide:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | connection string de Neon |
| `CORS_ORIGIN` | URL de la web en Vercel (puede quedar vacía en el primer despliegue) |
| `JWT_SECRET` | la genera Render automáticamente |
| `NODE_ENV`, `SEED_DEMO_DATA`, `NODE_VERSION` | ya definidas en `render.yaml` |

3. Verificar:

```bash
cd backend
npm run smoke -- https://<servicio>.onrender.com/api
```

> **Arranque en frío:** el plan gratuito duerme el servicio tras ~15 min sin tráfico; la primera
> petición tarda ~30-60 s. Los clientes usan un timeout de 60 s. Antes de una demo, abrir
> `https://<servicio>.onrender.com/api/health` para despertarlo.

## 3. APK — EAS Build

```bash
cd mobile
npx eas-cli@latest login          # cuenta de Expo (una vez)
npx eas-cli@latest init           # crea el projectId en app.json (una vez)
```

La URL del API del APK se fija en el perfil `preview` de [`mobile/eas.json`](../mobile/eas.json)
(`env.EXPO_PUBLIC_API_URL = https://<servicio>.onrender.com/api`). `mobile/.env` **no** se sube a
EAS (está en `.gitignore`), así que la IP de desarrollo nunca llega al build.

```bash
npx eas-cli@latest build --platform android --profile preview
```

Al terminar, EAS entrega la URL del build y del `.apk`. Antes de publicarlo se verifica que el
bundle embebido contenga la URL HTTPS del API y ninguna IP privada/localhost (ver README → APK).

## 4. Publicación del APK — GitHub Releases

1. Crear el release `v1.0.0` en el repositorio y adjuntar el APK como `vokter.apk`.
2. URL pública estable del asset:
   `https://github.com/<usuario>/<repo>/releases/download/v1.0.0/vokter.apk`
3. Comprobar que responde sin autenticación: `curl -I -L <url>` → `200` y
   `content-type: application/vnd.android.package-archive` (o `application/octet-stream`).

## 5. Web — Vercel

Proyecto con raíz `frontend/` (build `npm run build`, salida `dist`, rewrites SPA en
[`frontend/vercel.json`](../frontend/vercel.json)).

| Variable (Production) | Valor |
|---|---|
| `VITE_API_URL` | `https://<servicio>.onrender.com/api` |
| `VITE_APK_URL` | URL del asset del GitHub Release |
| `VITE_APK_VERSION` | `1.0.0` |

Las variables `VITE_*` se incrustan **al compilar**: tras cambiarlas hay que redesplegar.

## 6. Cerrar el ciclo — CORS

En Render, definir `CORS_ORIGIN=https://<proyecto>.vercel.app` (varios dominios separados por
coma). Render redespliega automáticamente.

## Actualizar la app

1. Subir `expo.version` y `android.versionCode` en `mobile/app.json`.
2. Nuevo build con EAS → nuevo release (`v1.1.0`) con el APK.
3. Actualizar `VITE_APK_URL` y `VITE_APK_VERSION` en Vercel y redesplegar la web.
