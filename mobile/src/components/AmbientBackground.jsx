import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Fondo ambiental: la constelación de la web (frontend/src/components/AmbientBackground.jsx),
 * nodos tenues unidos por líneas cuando están cerca.
 *
 * En la web cada nodo se mueve en un <canvas> a 60 fps. Redibujar ~40 nodos y sus líneas
 * en JS en cada frame es caro en un teléfono, así que aquí la constelación se dibuja una vez
 * (posiciones fijas con semilla, iguales en todas las pantallas) y lo que se anima es la capa
 * entera, a la deriva y despacio, con el driver nativo: sin coste en el hilo de JS.
 */

const NODE_COUNT = 42;
const CONNECT_DISTANCE = 140;
const SKY = '111,211,255';   // nodos destacados
const STEEL = '140,163,194'; // nodos y líneas de base

// Generador pseudoaleatorio con semilla: la constelación es la misma en cada pantalla
// y no "salta" al navegar.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildConstellation(width, height) {
  const rand = seeded(7);
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x: rand() * width,
    y: rand() * height,
    sky: rand() > 0.75,
  }));
  const lines = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < CONNECT_DISTANCE) lines.push({ a: nodes[i], b: nodes[j], opacity: (1 - dist / CONNECT_DISTANCE) * 0.15 });
    }
  }
  return { nodes, lines };
}

const DRIFT = 18;

export default function AmbientBackground() {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const drift = useRef(new Animated.Value(0)).current;

  // Se dibuja con margen (DRIFT) para que la deriva no destape los bordes.
  const { nodes, lines } = useMemo(() => buildConstellation(width + DRIFT * 2, height + DRIFT * 2), [width, height]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 22000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 22000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift, reducedMotion]);

  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -DRIFT * 1.6] });
  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -DRIFT] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.layer, { width: width + DRIFT * 2, height: height + DRIFT * 2, transform: [{ translateX }, { translateY }] }]}
    >
      <Svg width={width + DRIFT * 2} height={height + DRIFT * 2}>
        <G>
          {lines.map(({ a, b, opacity }, i) => (
            <Line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={`rgba(${STEEL},${opacity.toFixed(3)})`} strokeWidth={1} />
          ))}
        </G>
        {nodes.map((n, i) => (
          <Circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.sky ? 2 : 1.4}
            fill={n.sky ? `rgba(${SKY},0.5)` : `rgba(${STEEL},0.35)`}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // opacity-70 de la web
  layer: { position: 'absolute', top: 0, left: 0, opacity: 0.7 },
});
