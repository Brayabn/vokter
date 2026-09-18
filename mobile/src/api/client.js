import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';

const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

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

export default api;
