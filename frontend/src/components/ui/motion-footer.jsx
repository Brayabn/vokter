import { forwardRef, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NO_REDUCED_MOTION, useMotion } from '@/hooks/useMotion';

// Footer "cinemático" con revelado tipo telón (adaptado de 21st.dev).
// Las variables --foreground, --primary, etc. están definidas en src/index.css.
const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: color-mix(in oklch, var(--foreground) 6%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 14%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 12%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 12%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 4%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--primary) 55%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 24%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--secondary) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--secondary) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe { animation: footer-breathe 8s ease-in-out infinite alternate; }
.animate-footer-scroll-marquee { animation: footer-scroll-marquee 40s linear infinite; }
.animate-footer-heartbeat { display: inline-block; animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite; }

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 4%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 18%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 14%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 7%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 12%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 45%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}
`;

// -------------------------------------------------------------------------
// Botón "magnético": sigue levemente al cursor. Solo con puntero fino y sin
// reduced-motion; en táctil se comporta como un enlace normal.
// -------------------------------------------------------------------------
export const MagneticButton = forwardRef(function MagneticButton(
  { className, children, as: Component = 'button', ...props },
  forwardedRef
) {
  const localRef = useRef(null);

  useLayoutEffect(() => {
    const element = localRef.current;
    if (!element) return undefined;

    const mm = gsap.matchMedia();
    mm.add(`${NO_REDUCED_MOTION} and (hover: hover) and (pointer: fine)`, () => {
      const handleMouseMove = (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          rotationX: -y * 0.15,
          rotationY: x * 0.15,
          scale: 1.05,
          ease: 'power2.out',
          duration: 0.4,
        });
      };
      const handleMouseLeave = () => {
        gsap.to(element, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'elastic.out(1, 0.3)', duration: 1.2 });
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <Component
      ref={(node) => {
        localRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </Component>
  );
});

const DEFAULT_MARQUEE = ['VOKTER AI', 'Ropa', 'Tecnología', 'Calzado', 'Accesorios', 'Hogar', 'Deporte', 'Web + Android'];

function MarqueeItem({ items }) {
  return (
    <div className="flex items-center space-x-12 px-6">
      {items.map((item, i) => (
        <span key={item} className="flex items-center space-x-12">
          <span>{item}</span>
          <span className={i % 2 ? 'text-secondary/70' : 'text-primary/70'}>✦</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Footer de cierre del landing. Funciona como "puerta" al resto de la app:
 * `primaryLinks` / `secondaryLinks` son `{ to, label, icon? }` (rutas internas).
 */
export function CinematicFooter({
  heading = '¿Listo para empezar?',
  primaryLinks = [],
  secondaryLinks = [],
  marquee = DEFAULT_MARQUEE,
  brand = 'VØKTER',
}) {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useMotion(wrapperRef, () => {
    // Parallax del texto gigante de fondo
    gsap.fromTo(
      giantTextRef.current,
      { y: '10vh', scale: 0.8, opacity: 0 },
      {
        y: '0vh',
        scale: 1,
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', end: 'bottom bottom', scrub: 1 },
      }
    );

    // Revelado escalonado del contenido
    gsap.fromTo(
      [headingRef.current, linksRef.current],
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: wrapperRef.current, start: 'top 40%', end: 'bottom bottom', scrub: 1 },
      }
    );
  });

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Telón: el wrapper está en el flujo normal y con clip-path; el footer fijo
          de dentro solo se ve dentro de su caja, así que "aparece" debajo del contenido. */}
      <div
        ref={wrapperRef}
        className="relative h-svh w-full"
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      >
        <footer className="cinematic-footer-wrapper fixed bottom-0 left-0 flex h-svh w-full flex-col justify-between overflow-hidden bg-background text-foreground">
          <div className="footer-aurora animate-footer-breathe pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          {/* Texto gigante de fondo (centrado con flex para que GSAP pueda animar su transform) */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-[5vh] z-0 flex select-none justify-center" aria-hidden="true">
            <div ref={giantTextRef} className="footer-giant-bg-text font-display whitespace-nowrap">
              {brand}
            </div>
          </div>

          {/* 1. Marquesina diagonal */}
          <div className="absolute left-0 top-12 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-border/60 bg-background/60 py-4 shadow-2xl backdrop-blur-md" aria-hidden="true">
            <div className="animate-footer-scroll-marquee flex w-max text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
              <MarqueeItem items={marquee} />
              <MarqueeItem items={marquee} />
            </div>
          </div>

          {/* 2. Contenido central */}
          <div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
            <h2 ref={headingRef} className="footer-text-glow mb-12 text-center font-display text-5xl font-extrabold tracking-tighter md:text-8xl">
              {heading}
            </h2>

            <div ref={linksRef} className="flex w-full flex-col items-center gap-6">
              <div className="flex w-full flex-wrap justify-center gap-4">
                {primaryLinks.map(({ to, label, icon: Icon }, i) => (
                  <MagneticButton
                    key={to}
                    as={Link}
                    to={to}
                    className={cn(
                      'footer-glass-pill group flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold md:px-10 md:py-5 md:text-base',
                      i === 0 ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />}
                    {label}
                  </MagneticButton>
                ))}
              </div>

              {secondaryLinks.length > 0 && (
                <div className="mt-2 flex w-full flex-wrap justify-center gap-3 md:gap-6">
                  {secondaryLinks.map(({ to, label }) => (
                    <MagneticButton
                      key={to}
                      as={Link}
                      to={to}
                      className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                    >
                      {label}
                    </MagneticButton>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Barra inferior */}
          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-12">
            <div className="order-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:order-1 md:text-xs">
              © {new Date().getFullYear()} {brand}. Todos los derechos reservados.
            </div>

            <div className="footer-glass-pill order-1 flex cursor-default items-center gap-2 rounded-full px-6 py-3 md:order-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:text-xs">Hecho con</span>
              <span className="animate-footer-heartbeat text-sm text-sky md:text-base" aria-label="amor">❤</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:text-xs">por</span>
              <span className="ml-1 font-display text-xs font-extrabold text-foreground md:text-sm">{brand}</span>
            </div>

            <MagneticButton
              as="button"
              type="button"
              onClick={scrollToTop}
              aria-label="Volver arriba"
              className="footer-glass-pill group order-3 flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1.5" aria-hidden="true" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
