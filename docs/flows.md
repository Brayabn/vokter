# Flujos de VØKTER

## 1. Autenticación (web y móvil)

```mermaid
sequenceDiagram
  actor U as Usuario
  participant C as Cliente (web / app)
  participant S as Almacenamiento local<br/>(localStorage / SecureStore)
  participant A as API
  participant D as PostgreSQL

  U->>C: email + contraseña
  C->>C: validación (formato, longitud)
  C->>A: POST /api/auth/login
  A->>D: buscar usuario por email
  A->>A: bcrypt.compare + firmar JWT (7 días)
  A-->>C: { token, user }
  C->>S: guardar token + usuario
  Note over C,A: Peticiones siguientes: Authorization: Bearer <token>

  U->>C: reabre la app
  C->>S: leer token + usuario
  C-->>U: sesión restaurada al instante (sin esperar red)
  C->>A: GET /api/auth/me (revalidación)
  alt 401 / 404
    C->>S: borrar sesión → pantalla de login
  else error de red / timeout / 5xx
    C-->>U: se conserva la sesión
  end
```

## 2. Web

| Ruta | Acceso | Endpoints |
|---|---|---|
| `/` | Público | `POST /ai/match` (VOKTER AI en el hero) |
| `/registro`, `/login` | Público | `POST /auth/register`, `POST /auth/login` |
| `/explorar` | Público | `GET /categories`, `GET /contents?search=&categorySlug=` |
| `/contenido/:id` | Público (favoritos con sesión) | `GET /contents/:id`, `GET/POST/DELETE /favorites` |
| `/experto/:id` | Público | `GET /experts/:id` |
| `/dashboard` | Con sesión | `GET /contents?sort=rating`, `POST /ai/match` |
| `/favoritos` | Con sesión | `GET /favorites` |
| `/descarga` | Público | — (usa `VITE_APK_URL`) |

## 3. App móvil

```mermaid
flowchart TD
  Splash["Splash nativo<br/>(se mantiene mientras se restaura la sesión)"] --> Tabs
  subgraph Tabs["Pestañas"]
    Inicio["Inicio<br/>VOKTER AI · categorías · expertos"]
    Explorar["Explorar<br/>búsqueda con debounce · filtros"]
    Expertos["Expertos<br/>filtro por categoría"]
    Favoritos["Favoritos<br/>(solo con sesión)"]
    Perfil["Perfil / Login"]
  end
  Inicio --> Detalle["Detalle de contenido"]
  Explorar --> Detalle
  Favoritos --> Detalle
  Inicio --> PerfilExperto["Perfil de experto"]
  Expertos --> PerfilExperto
  Detalle --> PerfilExperto
  PerfilExperto --> Detalle
  Detalle -- "sin sesión" --> Login["Login (modal)"]
  Login <--> Registro["Registro (modal)"]
```

Mismos endpoints que la web. La URL del API se fija al compilar con `EXPO_PUBLIC_API_URL`
(perfil `preview` de `mobile/eas.json` → API pública HTTPS).

## 4. Integración web ↔ API ↔ móvil

- Un único backend y una única base de datos: las cuentas, los favoritos y el catálogo son compartidos.
- Contrato común: JSON, JWT en `Authorization`, errores `{ error }`. Ambos clientes interpretan los errores con la misma lógica (`api/errors.js`) y aplican el mismo criterio de cierre de sesión (solo `401`).
- CORS aplica solo a la web (dominio de Vercel en `CORS_ORIGIN`); la app nativa no envía `Origin`.

## 5. Descarga del APK

```mermaid
flowchart LR
  EAS["EAS Build<br/>perfil preview → APK"] --> APK["vokter.apk<br/>verificado: API HTTPS,<br/>sin IPs privadas"]
  APK --> REL["GitHub Release v1.0.0<br/>(asset público)"]
  REL -- "URL del asset" --> ENV["VITE_APK_URL<br/>(variable de Vercel)"]
  ENV --> PAGE["/descarga"]
  PAGE --> BTN["Botón 'Descargar APK'"]
  PAGE --> QR["Código QR"]
  BTN --> DL["Descarga en el teléfono"]
  QR -- "cámara del teléfono" --> DL
  DL --> INST["Instalar (orígenes desconocidos)"] --> OPEN["Abrir VØKTER"]
```

El botón y el QR leen **la misma constante** (`APK_URL` en `frontend/src/config/app.js`). Si la
variable falta o no es HTTPS, la página muestra "Descarga no disponible" en lugar de un QR falso.
