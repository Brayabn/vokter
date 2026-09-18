import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/errors';

/**
 * Ejecuta una petición al API y expone { data, loading, error, reload }.
 * Si llegan respuestas fuera de orden (p. ej. búsquedas rápidas), solo se
 * aplica la de la petición más reciente. Misma lógica que en la app móvil.
 */
export function useApiRequest(request, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const latestRequestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reload = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await request();
      if (requestId === latestRequestId.current) setState({ data, loading: false, error: null });
    } catch (err) {
      if (requestId === latestRequestId.current) {
        setState({ data: null, loading: false, error: getErrorMessage(err) });
      }
    }
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
