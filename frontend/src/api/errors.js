// Interpreta errores de axios de forma consistente (misma lógica que la app móvil).

// Sin `response`: el servidor nunca respondió (sin red, timeout, servidor dormido).
export function isNetworkError(err) {
  return Boolean(err) && !err.response;
}

export function getErrorMessage(err, fallback = 'Ocurrió un error inesperado. Intenta de nuevo.') {
  if (!err) return fallback;
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return 'El servidor tardó demasiado en responder. Intenta de nuevo en unos segundos.';
  }
  if (isNetworkError(err)) {
    return 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.';
  }
  // El backend responde { error: "mensaje" } en todos sus errores controlados.
  return err.response.data?.error || fallback;
}
