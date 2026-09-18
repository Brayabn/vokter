import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/errors';

/**
 * Ejecuta una petición al API y expone { data, loading, error, reload }.
 *
 * - `request`: función async que devuelve los datos ya extraídos de la respuesta.
 * - `deps`: cuándo volver a pedir (igual que en useEffect).
 * - `immediate`: si es false, no pide al montar (útil con useFocusEffect).
 *
 * Si llegan respuestas fuera de orden (p. ej. búsquedas rápidas), solo se
 * aplica la de la petición más reciente.
 */
export function useApiRequest(request, deps = [], { immediate = true } = {}) {
  const [state, setState] = useState({ data: null, loading: immediate, error: null });
  const latestRequestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reload = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await request();
      if (requestId === latestRequestId.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (err) {
      if (requestId === latestRequestId.current) {
        setState({ data: null, loading: false, error: getErrorMessage(err) });
      }
    }
  }, deps);

  useEffect(() => {
    if (immediate) reload();
  }, [reload, immediate]);

  return { ...state, reload };
}
