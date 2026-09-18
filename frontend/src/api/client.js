import axios from 'axios';

// URL del API: obligatoria vía VITE_API_URL (ver .env.example). Vite la incrusta en el build,
// por eso en producción debe definirse en Vercel antes de compilar. Sin valor por defecto a
// localhost: un build mal configurado debe fallar de forma visible, no apuntar a otra máquina.
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

if (!API_URL) {
  console.error('VITE_API_URL no está definida. Crea frontend/.env a partir de frontend/.env.example.');
}

// 60 s: el plan gratuito de Render "duerme" el servicio y la primera petición
// tras la inactividad puede tardar ~30-60 s en responder (arranque en frío).
const api = axios.create({ baseURL: API_URL, timeout: 60000 });

// AuthContext registra aquí qué hacer cuando el servidor rechaza el token.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

// Adjunta el token JWT guardado en localStorage a cada request, si existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vokter_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Un 401 en una petición que llevaba token = sesión expirada o inválida.
// Los errores de red no son 401, así que nunca cierran la sesión.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && sentToken && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

export default api;
