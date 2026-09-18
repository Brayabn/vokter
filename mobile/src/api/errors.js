// Utilidades para interpretar errores de axios de forma consistente en toda la app.
import { API_BASE_URL } from '../config';

// Solo en desarrollo: mostrar a qué URL se intentó conectar hace evidente un
// backend apagado o un puerto/IP equivocado. El APK de producción no lo muestra.
const devHint = __DEV__ ? `\n(API: ${API_BASE_URL || 'sin configurar'})` : '';

// Sin `response` significa que el servidor nunca respondió: sin red, timeout,
// servidor apagado o URL del API incorrecta. No es un error de la sesión.
export function isNetworkError(err) {
  return Boolean(err) && !err.response;
}

export function getErrorMessage(err, fallback = 'Ocurrió un error inesperado. Intenta de nuevo.') {
  if (!err) return fallback;
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return `El servidor tardó demasiado en responder. Intenta de nuevo.${devHint}`;
  }
  if (isNetworkError(err)) {
    return `No pudimos conectar con el servidor. Revisa tu conexión a internet.${devHint}`;
  }
  // El backend responde { error: "mensaje" } en todos sus errores controlados.
  return err.response.data?.error || fallback;
}
