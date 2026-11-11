import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Equivalente de prefers-reduced-motion (frontend/src/hooks/useMotion.js): con la opción
// "Quitar animaciones" del sistema activada, las animaciones decorativas no se ejecutan.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => active && setReduced(value));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
