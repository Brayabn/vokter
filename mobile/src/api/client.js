import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';

// 60 s: el plan gratuito de Render "duerme" el servicio y la primera petición
// tras la inactividad puede tardar ~30-60 s en responder (arranque en frío).
const api = axios.create({ baseURL: API_BASE_URL, timeout: 60000 });

// AuthContext registra aquí qué hacer cuando el servidor rechaza el token.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

// El token se guarda con SecureStore (Keychain en iOS, Keystore en Android),
// que lo encripta en el dispositivo — a diferencia de AsyncStorage, que guarda
// texto plano y es más fácil de extraer si el teléfono está comprometido.
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('vokter_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Un 401 en una petición que SÍ llevaba token significa sesión expirada o inválida.
// (El 401 del login, que va sin token, significa "credenciales incorrectas" y no aplica.)
// Los errores de red no pasan por aquí como 401, así que nunca cierran la sesión.
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
