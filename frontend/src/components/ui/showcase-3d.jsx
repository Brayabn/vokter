import { useRef } from 'react';
import { gsap } from 'gsap';
import { useMotion } from '@/hooks/useMotion';

/**
 * Vitrina 3D del hero: un cubo real en CSS 3D (transform-style: preserve-3d)
 * cuyas seis caras son las categorías de la tienda, con un aro de luz en el
 * suelo y etiquetas flotantes alrededor.
 *
 * Por qué CSS y no WebGL: no añade dependencias (three.js serían ~150 kB extra
 * en el primer render del landing), se ve nítido en cualquier densidad de
 * pantalla y degrada solo. Los estilos viven en src/index.css (.scene-3d,
 * .cube-3d, .cube-face, .cube-ring).
 *
 * Accesibilidad: es decoración, así que va con aria-hidden y las categorías
 * navegables están en la sección "Categorías" del landing. Sin JS o con
 * prefers-reduced-motion el cubo se queda quieto en su rotación base de CSS.
 */

const FACES = [
  { modifier: 'front', icon: '👕', label: 'Ropa' },
  { modifier: 'right', icon: '💻', label: 'Tecnología' },
  { modifier: 'back', icon: '👟', label: 'Calzado' },
  { modifier: 'left', icon: '⌚', label: 'Accesorios' },
  { modifier: 'top', icon: '🛋️', label: 'Hogar' },
  { modifier: 'bottom', icon: '🏀', label: 'Deporte' },
];

const CHIPS = [
  { text: '92% match', className: 'left-0 top-10 border-sky/40 bg-sky/10 text-sky' },
  { text: '10 marcas · 18 artículos', className: 'right-0 top-28 border-white/15 bg-white/5 text-mist' },
  { text: 'Favoritos sincronizados', className: 'bottom-12 left-4 border-azure/40 bg-azure/10 text-mist' },
];

export default function Showcase3D({ className = '' }) {
  const sceneRef = useRef(null);
  const tiltRef = useRef(null);
  const cubeRef = useRef(null);

  useMotion(sceneRef, () => {
    // Giro continuo del cubo. rotationX fijo para que siempre se vean tres caras.
    gsap.set(cubeRef.current, { rotationX: -16, rotationY: -30 });
    gsap.to(cubeRef.current, {
      rotationY: '+=360',
      duration: 26,
      ease: 'none',
      repeat: -1,
    });

    // Las etiquetas flotan en vertical, cada una a su ritmo.
    gsap.utils.toArray('.showcase-chip').forEach((chip, i) => {
      gsap.to(chip, {
        y: i % 2 === 0 ? -14 : 14,
        duration: 3 + i * 0.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    // Parallax: la escena completa se inclina siguiendo al puntero. Solo con
    // puntero fino; en táctil el cubo simplemente gira.
    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const scene = sceneRef.current;
      const tilt = tiltRef.current;
      const onMove = (e) => {
        const rect = scene.getBoundingClientRect();
        const dx = (e.clientX - rect.left) / rect.width - 0.5;
        const dy = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(tilt, { rotationY: dx * 18, rotationX: -dy * 14, duration: 0.8, ease: 'power2.out' });
      };
      const onLeave = () => gsap.to(tilt, { rotationY: 0, rotationX: 0, duration: 1.2, ease: 'power3.out' });

      window.addEventListener('pointermove', onMove, { passive: true });
      scene.addEventListener('pointerleave', onLeave);
      return () => {
        window.removeEventListener('pointermove', onMove);
        scene.removeEventListener('pointerleave', onLeave);
      };
    });
    return () => mm.revert();
  });

  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden="true">
      {/* Halo detrás del cubo */}
      <div className="pointer-events-none absolute h-[26rem] w-[26rem] max-w-full rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.28),rgba(111,211,255,0.10)_45%,transparent_70%)] blur-2xl" />

      <div
        ref={sceneRef}
        className="scene-3d relative flex h-[26rem] w-full items-center justify-center sm:h-[32rem]"
        style={{ '--cube-size': 'clamp(8.5rem, 22vw, 14rem)' }}
      >
        <div ref={tiltRef} className="scene-tilt">
          <div className="cube-ring" />
          <div className="cube-ring scale-75 opacity-60" />

          <div ref={cubeRef} className="cube-3d">
            {FACES.map(({ modifier, icon, label }) => (
              <div key={modifier} className={`cube-face cube-face--${modifier}`}>
                <span className="text-3xl drop-shadow-[0_0_12px_rgba(111,211,255,0.5)] sm:text-4xl">{icon}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-sky sm:text-xs">{label}</span>
              </div>
            ))}
          </div>

          {CHIPS.map(({ text, className: chipClass }) => (
            <span
              key={text}
              className={`showcase-chip absolute rounded-full border px-4 py-2 font-mono text-[0.65rem] shadow-xl backdrop-blur sm:text-xs ${chipClass}`}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
