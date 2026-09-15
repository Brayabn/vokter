import { useEffect, useRef } from 'react';

const NODE_COUNT = 42;
const CONNECT_DISTANCE = 140;
const GOLD = 'rgba(232, 176, 75,';
const LAVENDER = 'rgba(168, 174, 196,';

/**
 * Fondo ambiental de baja intensidad: nodos que se mueven lentamente y se
 * conectan cuando están cerca, evocando "red de conocimiento" sin costar
 * la complejidad de un motor 3D real. Se detiene si el usuario prefiere
 * menos movimiento (prefers-reduced-motion).
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, nodes, rafId;

    function resize() {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
        gold: Math.random() > 0.75,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const maxDist = CONNECT_DISTANCE * devicePixelRatio;
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `${LAVENDER}${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `${n.gold ? GOLD : LAVENDER}${n.gold ? 0.5 : 0.35})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.gold ? 2 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    resize();
    initNodes();
    window.addEventListener('resize', resize);

    if (!prefersReducedMotion) {
      step();
    } else {
      // Dibuja un solo frame estático, sin animar, si el usuario lo prefiere.
      step();
      cancelAnimationFrame(rafId);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none opacity-70"
      style={{ zIndex: 0 }}
    />
  );
}
