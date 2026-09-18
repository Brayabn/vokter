import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import api, { setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

const TOKEN_KEY = 'vokter_token';
// Copia local del usuario: permite restaurar la sesión al instante y sin conexión.
const USER_KEY = 'vokter_user';

async function saveSession(token, user) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}

async function readCachedUser() {
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cualquier 401 con token (en cualquier pantalla) cierra la sesión local.
    setUnauthorizedHandler(() => {
      clearSession();
      setUser(null);
    });

    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      const cachedUser = await readCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
      }

      // Revalida el token con el servidor.
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.data.user));
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 404) {
          // Token inválido/expirado o usuario inexistente: la sesión ya no es válida.
          await clearSession();
          setUser(null);
        }
        // Sin respuesta (red, timeout) o error 5xx: se conserva la sesión.
      } finally {
        setLoading(false);
      }
    })();

    return () => setUnauthorizedHandler(null);
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    await saveSession(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(payload) {
    const res = await api.post('/auth/register', payload);
    await saveSession(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    await clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
