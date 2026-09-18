import { useEffect, useState } from 'react';

// Devuelve `value` solo cuando deja de cambiar durante `delay` ms
// (evita una petición al API por cada tecla en la búsqueda).
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
