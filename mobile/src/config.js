// URL base del API. Se define con la variable EXPO_PUBLIC_API_URL (ver .env.example):
// Expo la incrusta en el bundle al compilar, tanto en `expo start` como en EAS Build.
// Debe leerse con acceso estático (process.env.EXPO_PUBLIC_API_URL) para que Expo la reemplace.
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!rawApiUrl) {
  console.warn(
    'EXPO_PUBLIC_API_URL no está definida. Crea mobile/.env a partir de mobile/.env.example.'
  );
}

// Sin barra final, para que axios concatene bien las rutas ("/auth/login", etc.)
export const API_BASE_URL = (rawApiUrl || '').replace(/\/+$/, '');
