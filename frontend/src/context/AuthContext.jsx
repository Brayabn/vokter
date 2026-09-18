import { createContext, useContext, useEffect, useState } from 'react';
import api, { setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

const TOKEN_KEY = 'vokter_token';
// Copia local del usuario: la sesión se restaura al instante aunque el API tarde o no responda.
const USER_KEY = 'vokter_user';

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function readCachedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cualquier 401 con token (en cualquier página) cierra la sesión local.
    setUnauthorizedHandler(() => {
      clearSession();
      setUser(null);
    });

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return () => setUnauthorizedHandler(null);
    }

    const cachedUser = readCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
    }

    // Revalida el token con el servidor.
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401 || status === 404) {
          // Token inválido/expirado o usuario inexistente.
          clearSession();
          setUser(null);
        }
        // Error de red, timeout o 5xx: se conserva la sesión.
      })
      .finally(() => setLoading(false));

    return () => setUnauthorizedHandler(null);
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(payload) {
    const res = await api.post('/auth/register', payload);
    saveSession(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    clearSession();
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
