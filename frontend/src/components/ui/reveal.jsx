import { useRef } from 'react';
import { gsap } from 'gsap';
import { useMotion } from '@/hooks/useMotion';

/**
 * Revela sus hijos directos (o los que coincidan con `selector`) al entrar en
 * pantalla: suben y aparecen de forma escalonada. Sin reduced-motion no anima.
 * `deps` permite re-ejecutarlo cuando los hijos cambian (p. ej. al llegar datos).
 */
export function Reveal({ as: Component = 'div', selector = ':scope > *', stagger = 0.08, y = 32, deps = [], children, ...props }) {
  const ref = useRef(null);

  useMotion(ref, () => {
    const targets = ref.current.querySelectorAll(selector);
    if (!targets.length) return;
    gsap.from(targets, {
      y,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
    });
  }, deps);

  return <Component ref={ref} {...props}>{children}</Component>;
}
