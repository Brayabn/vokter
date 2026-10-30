import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NO_REDUCED_MOTION } from '@/hooks/useMotion';

/**
 * Al cambiar de ruta: vuelve arriba y hace entrar la nueva página con un fundido.
 * Solo depende del pathname (cambiar ?categoria= en /explorar no re-anima ni hace scroll).
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const ref = useRef(null);

  useLayoutEffect(() => {
    // 'instant' evita el scroll suave global (html { scroll-behavior: smooth }) al navegar.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const mm = gsap.matchMedia();
    mm.add(NO_REDUCED_MOTION, () => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 24, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power3.out',
          // Sin transform/filter residuales: crearían un bloque contenedor que rompe
          // el footer fijo del landing y el background-attachment: fixed de GlowCard.
          clearProps: 'opacity,transform,filter',
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    });
    return () => mm.revert();
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
