# Despliegue de VØKTER

Orden recomendado: **Neon → Render (API) → EAS (APK) → GitHub Release → Vercel (web) → CORS**.
Ningún secreto se guarda en el repositorio: todos se definen en el panel de cada plataforma.

> **Local vs. producción.** `docker-compose.yml` (web + API + PostgreSQL en contenedores) es solo
> para instalación y demostración local — ver README → *Instalación rápida con Docker*. Producción no
> usa esos contenedores: Render ejecuta el backend con su runtime Node nativo (`render.yaml`), Vercel
> compila la web con Vite y la base de datos es Neon.

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

El despliegue por Git parte de la **raíz del repositorio**, así que la configuración vive en
[`vercel.json`](../vercel.json) (raíz): compila `frontend/` con `npm ci` + `npm run build` y publica
`frontend/dist`, con los rewrites de SPA y las cabeceras de seguridad.

> **Dos `vercel.json`.** Vercel solo lee el que está dentro del *Root Directory* del proyecto. Con
> Root Directory vacío (la configuración actual) manda el de la raíz; si se fija
> `Root Directory = frontend`, manda [`frontend/vercel.json`](../frontend/vercel.json) y el de la
> raíz se ignora. Los dos traen los mismos rewrites y cabeceras: **al tocar uno hay que tocar el otro**.

| Variable (Production) | Valor |
|---|---|
| `VITE_API_URL` | `https://<servicio>.onrender.com/api` |
| `VITE_APK_URL` | URL del asset del GitHub Release |
| `VITE_APK_VERSION` | `1.0.0` |

Las variables `VITE_*` se incrustan **al compilar**: tras cambiarlas hay que redesplegar.

### Despliegue automático desde Git

Un proyecto creado con `vercel` (CLI) desde `frontend/` **solo se actualiza cuando alguien vuelve a
ejecutar el CLI**: un `git push` no lo redespliega. Para que cada push a `main` publique la web hay
que conectar el repositorio en **Settings → Git** con Production Branch `main`.

Al conectarlo, el build pasa a arrancar en la raíz del repositorio, no en `frontend/`. Si no hay un
`vercel.json` en la raíz, Vercel no detecta framework, **no compila nada** y publica el repositorio
tal cual: `/` responde 404 y quedan expuestos `render.yaml`, `docker-compose.yml` y `docs/`. Eso es
lo que corrige el `vercel.json` de la raíz.

Comprobaciones sin entrar al panel:

```bash
gh api repos/Brayabn/vokter/commits/main/status --jq '.statuses[].state'    # success = Vercel construyó
gh api "repos/Brayabn/vokter/deployments?per_page=5" --jq '.[].environment' # Production = despliegue de Vercel
curl -s -o /dev/null -w '%{http_code}\n' https://vokter-web.vercel.app/render.yaml  # debe ser el HTML de la SPA, no el YAML
```

> **Cuidado con «Redeploy».** El botón *Redeploy* de un despliegue existente reconstruye **el mismo
> commit**, no el último de `main`. Para publicar lo último: *Deployments → Create Deployment* (o
> `vercel --prod`).

Verificar que producción corresponde al último commit, sin abrir el navegador:

```bash
curl -sI https://vokter-web.vercel.app/ | grep -i content-security-policy   # debe existir
curl -s https://vokter-web.vercel.app/ | grep -i '<title>'                  # debe coincidir con frontend/index.html
```

## 6. Cerrar el ciclo — CORS

En Render, definir `CORS_ORIGIN=https://<proyecto>.vercel.app` (varios dominios separados por
coma). Render redespliega automáticamente.

## Actualizar la app

> **El APK no se actualiza solo.** La web se redespliega con cada push a `main`, pero un APK ya
> instalado sigue ejecutando el JavaScript que se empaquetó el día que se compiló. Cambiar
> `mobile/src/` no afecta a los teléfonos que ya tienen la app: **hay que recompilar y volver a
> publicar**. Si la app muestra una versión vieja, lo primero que hay que mirar es la fecha del
> release del APK frente a la del último commit que tocó `mobile/`.

1. Subir `expo.version` y `android.versionCode` en `mobile/app.json`.
2. Nuevo build con EAS:

```bash
cd mobile
npx eas-cli@latest login            # cuenta de Expo (solo la primera vez)
npx eas-cli@latest build --platform android --profile preview
```

3. Descargar el `.apk` que entrega EAS, crear el release en GitHub y adjuntarlo.
4. Actualizar `VITE_APK_URL` y `VITE_APK_VERSION` en Vercel y redesplegar la web.

**Por qué EAS y no un build local.** EAS firma con el keystore que gestiona él mismo, el mismo de
los APK anteriores, así que el nuevo se instala **encima** del que ya está en el teléfono. Un build
local (`npx expo prebuild -p android` + `./gradlew assembleRelease`) usa el keystore de depuración:
genera un APK válido para probar, pero con otra firma, así que Android lo rechaza sobre el anterior
y obliga a desinstalar primero. Además compila código nativo para cuatro arquitecturas, lo que pide
bastante RAM.

**La URL del API en el APK.** `mobile/.env` está en `.gitignore` y nunca se sube a EAS, así que la
IP privada que se usa en desarrollo no puede acabar dentro del APK: el valor que se empaqueta es el
`EXPO_PUBLIC_API_URL` del perfil de [`mobile/eas.json`](../mobile/eas.json). Para comprobarlo sin
instalar nada, se exporta el bundle y se inspecciona:

```bash
cd mobile
EXPO_PUBLIC_API_URL=https://<servicio>.onrender.com/api npx expo export --platform android --output-dir /tmp/vokter-export
grep -ao "https://[a-z0-9.-]*onrender.com/api" /tmp/vokter-export/_expo/static/js/android/*.hbc | head -1
grep -aoE "192\.168\.[0-9]+\.[0-9]+" /tmp/vokter-export/_expo/static/js/android/*.hbc   # debe estar vacío
```
