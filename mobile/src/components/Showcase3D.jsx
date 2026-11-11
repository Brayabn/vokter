import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Svg, { Defs, Ellipse, G, LinearGradient, Path, Polygon, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { alpha, colors, fonts } from '../theme';
import Halo from './Halo';

/**
 * Vitrina 3D del hero (frontend/src/components/ui/showcase-3d.jsx): un cubo que gira con
 * las seis categorías de la tienda en sus caras, un aro de luz alrededor y etiquetas
 * flotantes.
 *
 * La web usa CSS 3D (preserve-3d + translateZ). React Native no tiene ninguna de las dos en
 * Android, así que aquí el cubo se proyecta a mano: cada frame se rotan los 8 vértices, se
 * aplica la perspectiva y se dibujan con SVG solo las caras que miran a la cámara. El
 * contenido de cada cara (emoji + etiqueta) se deforma con una matriz afín para que quede
 * "pegado" a la cara en perspectiva, como en la web.
 *
 * Es decoración: va oculta a los lectores de pantalla y se queda quieta con "Quitar
 * animaciones" activado o cuando la pantalla no está visible.
 */

const FACES = [
  { key: 'front', icon: '👕', label: 'ROPA', c: [0, 0, 1], u: [1, 0, 0], v: [0, -1, 0] },
  { key: 'right', icon: '💻', label: 'TECNOLOGÍA', c: [1, 0, 0], u: [0, 0, -1], v: [0, -1, 0] },
  { key: 'back', icon: '👟', label: 'CALZADO', c: [0, 0, -1], u: [-1, 0, 0], v: [0, -1, 0] },
  { key: 'left', icon: '⌚', label: 'ACCESORIOS', c: [-1, 0, 0], u: [0, 0, 1], v: [0, -1, 0] },
  { key: 'top', icon: '🛋️', label: 'HOGAR', c: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { key: 'bottom', icon: '🏀', label: 'DEPORTE', c: [0, -1, 0], u: [1, 0, 0], v: [0, 0, -1] },
];

const CHIPS = [
  { text: '92% match', style: { left: 0, top: 40, borderColor: alpha.sky40, backgroundColor: alpha.sky10 }, color: colors.sky },
  { text: '10 marcas · 18 artículos', style: { right: 0, top: 112, borderColor: alpha.white15, backgroundColor: alpha.white5 }, color: colors.mist },
  { text: 'Favoritos sincronizados', style: { left: 16, bottom: 48, borderColor: 'rgba(30,107,255,0.4)', backgroundColor: alpha.azure10 }, color: colors.mist },
];

const TILT = (16 * Math.PI) / 180;       // rotateX(-16deg) de la web: se ve la cara superior
const START = (-30 * Math.PI) / 180;     // rotateY(-30deg) inicial
const PERIOD = 26000;                    // una vuelta cada 26 s, como en la web
const RING_TILT = Math.cos((78 * Math.PI) / 180);

function rotate([x, y, z], theta) {
  // rotateY(theta) y luego rotateX(TILT), con el eje y hacia arriba y la cámara en +z
  const x1 = x * Math.cos(theta) + z * Math.sin(theta);
  const z1 = -x * Math.sin(theta) + z * Math.cos(theta);
  const y2 = y * Math.cos(TILT) - z1 * Math.sin(TILT);
  const z2 = y * Math.sin(TILT) + z1 * Math.cos(TILT);
  return [x1, y2, z2];
}

function FloatingChip({ chip, index, animate }) {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) return undefined;
    const half = (3000 + index * 600);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: 1, duration: half, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: half, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animate, index, y]);
  const translateY = y.interpolate({ inputRange: [0, 1], outputRange: [0, index % 2 === 0 ? -14 : 14] });
  return (
    <Animated.View style={[styles.chip, chip.style, { transform: [{ translateY }] }]}>
      <Text style={[styles.chipText, { color: chip.color }]}>{chip.text}</Text>
    </Animated.View>
  );
}

export default function Showcase3D({ height = 380 }) {
  const { width: windowWidth } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const focused = useIsFocused();
  const [theta, setTheta] = useState(START);

  const width = windowWidth - 48;
  const size = Math.min(Math.max(windowWidth * 0.36, 136), 190); // clamp(8.5rem, 22vw, 14rem)
  const h = size / 2;
  const d = size * 5; // perspective: 1100px
  const cx = width / 2;
  const cy = height / 2;
  const animate = !reducedMotion && focused;

  useEffect(() => {
    if (!animate) return undefined;
    let raf;
    let last = null;
    const tick = (t) => {
      if (last !== null) setTheta((prev) => prev + ((t - last) / PERIOD) * Math.PI * 2);
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const project = (p) => {
    const [x, y, z] = rotate(p.map((n) => n * h), theta);
    const k = d / (d - z);
    return [cx + x * k, cy - y * k, z];
  };
  const add = (a, b, sign = 1) => a.map((n, i) => n + sign * b[i]);

  const faces = FACES.map((f) => {
    // Cara visible si su normal apunta hacia la cámara (en 0, 0, d)
    const [nx, ny, nz] = rotate(f.c, theta);
    const [ccx, ccy, ccz] = rotate(f.c.map((n) => n * h), theta);
    const facing = nx * (0 - ccx) + ny * (0 - ccy) + nz * (d - ccz);
    if (facing <= 0) return null;

    const corners = [
      add(add(f.c, f.u, -1), f.v, -1),
      add(add(f.c, f.u), f.v, -1),
      add(add(f.c, f.u), f.v),
      add(add(f.c, f.u, -1), f.v),
    ].map(project);
    const p0 = project(f.c);
    const pu = project(add(f.c, f.u));
    const pv = project(add(f.c, f.v));
    const matrix = [(pu[0] - p0[0]) / h, (pu[1] - p0[1]) / h, (pv[0] - p0[0]) / h, (pv[1] - p0[1]) / h, p0[0], p0[1]];
    return { ...f, points: corners.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '), matrix, light: Math.min(1, nz + 0.25) };
  }).filter(Boolean);

  const ring = (scale) => {
    const rx = size * scale;
    const ry = size * scale * RING_TILT;
    return {
      back: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
      front: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`,
    };
  };
  const rings = [{ ...ring(1), opacity: 1 }, { ...ring(0.75), opacity: 0.6 }];

  return (
    <View style={[styles.scene, { height }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Halo
        width={Math.min(416, width)}
        stops={[[0, '#1E6BFF', 0.28], [0.45, '#6FD3FF', 0.1], [0.7, '#6FD3FF', 0], [1, '#6FD3FF', 0]]}
        style={{ left: (width - Math.min(416, width)) / 2, top: (height - Math.min(416, width)) / 2 }}
      />
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="face" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#123A8C" stopOpacity="0.75" />
            <Stop offset="1" stopColor="#04070D" stopOpacity="0.92" />
          </LinearGradient>
          <RadialGradient id="shine" cx="20%" cy="10%" r="120%">
            <Stop offset="0" stopColor="#6FD3FF" stopOpacity="0.16" />
            <Stop offset="0.6" stopColor="#6FD3FF" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Mitad trasera de los aros: por detrás del cubo */}
        {rings.map((r, i) => (
          <Path key={`b${i}`} d={r.back} stroke="rgba(111,211,255,0.22)" strokeOpacity={r.opacity} strokeWidth={1} fill="none" />
        ))}

        {faces.map((f) => (
          <G key={f.key} opacity={0.8 + 0.2 * f.light}>
            <Polygon points={f.points} fill="url(#face)" />
            <Polygon points={f.points} fill="url(#shine)" stroke="rgba(111,211,255,0.32)" strokeWidth={1} strokeLinejoin="round" />
            <G transform={`matrix(${f.matrix.map((n) => n.toFixed(4)).join(' ')})`}>
              <SvgText x={0} y={4} fontSize={size * 0.22} textAnchor="middle">{f.icon}</SvgText>
              <SvgText x={0} y={size * 0.2} fontSize={size * 0.068} fontFamily={fonts.monoMedium} letterSpacing={size * 0.02} fill={colors.sky} textAnchor="middle">
                {f.label}
              </SvgText>
            </G>
          </G>
        ))}

        {/* Mitad delantera de los aros: por delante del cubo */}
        {rings.map((r, i) => (
          <Path key={`f${i}`} d={r.front} stroke="rgba(111,211,255,0.30)" strokeOpacity={r.opacity} strokeWidth={1} fill="none" />
        ))}
        <Ellipse cx={cx} cy={cy + size * 0.95} rx={size * 0.7} ry={size * 0.08} fill="rgba(30,107,255,0.10)" />
      </Svg>

      {CHIPS.map((chip, i) => <FloatingChip key={chip.text} chip={chip} index={i} animate={!reducedMotion} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  scene: { position: 'relative', alignSelf: 'stretch', justifyContent: 'center' },
  chip: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.5)',
  },
  chipText: { fontFamily: fonts.mono, fontSize: 11 },
});
