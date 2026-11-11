import { useCallback, useState } from 'react';

/**
 * Entradas ligadas al scroll del inicio: el equivalente de los ScrollTrigger de GSAP del
 * landing web. Todo se calcula con interpolaciones de un único Animated.Value (scrollY) que
 * mueve el driver nativo, así que no cuesta nada en el hilo de JS mientras se hace scroll.
 *
 * `measure(key)` devuelve un onLayout que guarda { y, height } del elemento bajo esa clave.
 * onLayout da la posición relativa al padre: para un elemento anidado hay que sumarle la
 * de sus contenedores antes de pasarla a `reveal`.
 */
export function useScrollReveal(scrollY, viewportHeight) {
  const [layouts, setLayouts] = useState({});

  const measure = useCallback(
    (key) => (e) => {
      const { y, height } = e.nativeEvent.layout;
      setLayouts((prev) => (prev[key]?.y === y && prev[key]?.height === height ? prev : { ...prev, [key]: { y, height } }));
    },
    []
  );

  // Aparece (fade + desplazamiento) cuando su borde superior cruza el 85 % de la pantalla,
  // como `start: 'top 85%'` en la web.
  const reveal = useCallback(
    (absoluteY, { distance = 60, axis = 'y', span = 220 } = {}) => {
      if (absoluteY == null) return null;
      const start = absoluteY - viewportHeight * 0.85;
      const range = [start, start + span];
      const offset = scrollY.interpolate({ inputRange: range, outputRange: [distance, 0], extrapolate: 'clamp' });
      return {
        opacity: scrollY.interpolate({ inputRange: range, outputRange: [0, 1], extrapolate: 'clamp' }),
        transform: [axis === 'x' ? { translateX: offset } : { translateY: offset }],
      };
    },
    [scrollY, viewportHeight]
  );

  return { layouts, measure, reveal };
}
