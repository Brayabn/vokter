import { useEffect } from 'react';
import { cn } from '@/lib/utils';

// Tarjeta con borde luminoso que sigue al puntero (adaptada de 21st.dev).
// Los estilos de ::before / ::after viven en src/index.css.

// El tono del brillo se calcula como base + (posición X del puntero * spread).
// Los rangos están acotados a azules a propósito: la paleta de VØKTER es negro,
// azul, azul claro y blanco, así que el borde luminoso nunca sale de ahí.
const glowColorMap = {
  azure: { base: 202, spread: 32 }, // azul claro → azul (acento principal)
  sky: { base: 188, spread: 22 },   // cian → azul claro
  deep: { base: 218, spread: 20 },  // azul profundo, para superficies grandes
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

// Un solo listener para todas las tarjetas: escribe --x/--y en :root y cada tarjeta
// los hereda. Con N tarjetas en pantalla no se registran N listeners.
let pointerSubscribers = 0;

function syncPointer(e) {
  const root = document.documentElement.style;
  root.setProperty('--x', e.clientX.toFixed(2));
  root.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
  root.setProperty('--y', e.clientY.toFixed(2));
  root.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
}

function useSharedPointer() {
  useEffect(() => {
    if (pointerSubscribers++ === 0) document.addEventListener('pointermove', syncPointer, { passive: true });
    return () => {
      if (--pointerSubscribers === 0) document.removeEventListener('pointermove', syncPointer);
    };
  }, []);
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'azure',
  size = 'md',
  width,
  height,
  customSize = false, // true: ignora `size` y deja el tamaño a className / width / height
  as: Component = 'div',
  style,
  ...props
}) {
  useSharedPointer();

  const { base, spread } = glowColorMap[glowColor] || glowColorMap.azure;

  const inlineStyles = {
    '--base': base,
    '--spread': spread,
    '--radius': '20',
    '--border': '1.5',
    '--backdrop': 'hsl(218 55% 5% / 0.74)',
    '--backup-border': 'hsl(214 40% 22% / 0.9)',
    '--size': '220',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.08)), transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
    ...style,
  };

  return (
    <Component
      data-glow
      style={inlineStyles}
      className={cn(
        !customSize && sizeMap[size],
        !customSize && 'aspect-[3/4] grid grid-rows-[1fr_auto] gap-4 p-4',
        'relative rounded-[20px] shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[6px]',
        className
      )}
      {...props}
    >
      <div data-glow data-glow-inner aria-hidden="true" />
      {children}
    </Component>
  );
}
