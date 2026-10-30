import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const NO_REDUCED_MOTION = '(prefers-reduced-motion: no-preference)';

/**
 * Ejecuta `setup` (tweens / ScrollTriggers de GSAP) solo si el usuario no pidió
 * menos movimiento, con los selectores acotados a `scopeRef`. Todo se revierte al
 * desmontar, así que el contenido debe ser visible SIN animación: las animaciones
 * parten de `from`, nunca de clases opacity-0 en el markup.
 */
export function useMotion(scopeRef, setup, deps = []) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined;
    const mm = gsap.matchMedia(scopeRef.current);
    mm.add(NO_REDUCED_MOTION, setup);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
