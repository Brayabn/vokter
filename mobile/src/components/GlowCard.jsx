import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { card, cardShadow, radius } from '../theme';
import { hslToHex } from '../utils/color';

/**
 * Tarjeta con borde luminoso: la GlowCard de la web (frontend/src/components/ui/spotlight-card.jsx).
 *
 * En la web el foco de luz sigue al puntero; en el teléfono sigue al dedo: al tocar la
 * tarjeta el brillo salta al punto del toque, se intensifica y se queda ahí al soltar,
 * igual que en la web se queda donde estuvo el cursor. Sin tocarla, el foco descansa en la
 * esquina superior izquierda para que la tarjeta no se vea plana.
 *
 * El borde luminoso es un <Rect> SVG con un trazo en degradado radial: el mismo efecto que
 * el ::before enmascarado al borde de la web, sin máscaras CSS.
 *
 * Con `onPress` toda la tarjeta es pulsable (y sus hijos no reciben toques); sin `onPress`
 * es una superficie normal y sus hijos pueden tener botones propios.
 */

// Tono = base + posición horizontal del toque * spread. Los mismos rangos de la web:
// siempre azules, la paleta de VØKTER no sale de ahí.
const GLOW_COLORS = {
  azure: { base: 202, spread: 32 },
  sky: { base: 188, spread: 22 },
  deep: { base: 218, spread: 20 },
};

const SPOT_SIZE = 220;
const REST_OPACITY = 0.55;
const BORDER = card.borderWidth;
const HALF = BORDER / 2;

export default function GlowCard({ children, style, glowColor = 'azure', onPress, accessibilityLabel, accessibilityRole }) {
  const [size, setSize] = useState(null);
  const [spot, setSpot] = useState(null);
  const intensity = useRef(new Animated.Value(REST_OPACITY)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const { base, spread } = GLOW_COLORS[glowColor] || GLOW_COLORS.azure;

  function animateTo(toIntensity, toScale) {
    Animated.parallel([
      Animated.timing(intensity, { toValue: toIntensity, duration: toIntensity > REST_OPACITY ? 120 : 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: toScale, speed: 28, bounciness: 8, useNativeDriver: true }),
    ]).start();
  }

  function handlePressIn(e) {
    setSpot({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
    animateTo(1, 0.98);
  }

  const sx = spot ? spot.x : (size?.width || 0) * 0.18;
  const sy = spot ? spot.y : 0;
  const hue = base + (size ? Math.min(Math.max(sx / size.width, 0), 1) : 0.5) * spread;
  const borderColor = hslToHex(hue, 100, 50, 2); // brightness(2) de la web
  const fillColor = hslToHex(hue, 100, 70);

  const content = (
    <Animated.View
      style={[styles.card, style, { transform: [{ scale }] }]}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
      // Con onPress el Pressable es el único destino del toque: así locationX/Y son
      // relativos a la tarjeta y no al hijo que se tocó.
      pointerEvents={onPress ? 'none' : 'auto'}
    >
      {size && (
        // Los hijos absolutos se colocan dentro del borde: la capa se desplaza -BORDER para
        // cubrir la tarjeta entera y poder pintar el trazo justo encima del borde.
        <Animated.View style={[styles.glowLayer, { width: size.width, height: size.height, opacity: intensity }]} pointerEvents="none">
          <Svg width={size.width} height={size.height}>
            <Defs>
              <RadialGradient id="fill" cx={sx} cy={sy} r={SPOT_SIZE} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={fillColor} stopOpacity="0.10" />
                <Stop offset="1" stopColor={fillColor} stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="border" cx={sx} cy={sy} r={SPOT_SIZE * 0.75} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={borderColor} stopOpacity="1" />
                <Stop offset="1" stopColor={borderColor} stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="hot" cx={sx} cy={sy} r={SPOT_SIZE * 0.5} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width={size.width} height={size.height} rx={radius.lg} fill="url(#fill)" />
            {/* Halo difuso del borde (la capa data-glow-inner de la web) */}
            <Rect x={3} y={3} width={size.width - 6} height={size.height - 6} rx={radius.lg - 3} fill="none" stroke="url(#border)" strokeWidth={4} strokeOpacity={0.18} />
            <Rect x={HALF} y={HALF} width={size.width - BORDER} height={size.height - BORDER} rx={radius.lg - HALF} fill="none" stroke="url(#border)" strokeWidth={BORDER} />
            <Rect x={HALF} y={HALF} width={size.width - BORDER} height={size.height - BORDER} rx={radius.lg - HALF} fill="none" stroke="url(#hot)" strokeWidth={BORDER} />
          </Svg>
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={() => animateTo(REST_OPACITY, 1)}
      accessibilityRole={accessibilityRole || 'button'}
      accessibilityLabel={accessibilityLabel}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...card,
    overflow: 'hidden',
    ...cardShadow, // shadow-[0_1rem_2rem_-1rem_black]
  },
  glowLayer: { position: 'absolute', top: -BORDER, left: -BORDER },
});
