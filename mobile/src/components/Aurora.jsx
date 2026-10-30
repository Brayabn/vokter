import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

/**
 * Fondo ambiental de la app: dos manchas de luz azul detrás del contenido.
 *
 * React Native no tiene degradados radiales ni blur sin dependencias nativas
 * (expo-linear-gradient / expo-blur), así que cada mancha se construye con
 * círculos concéntricos de opacidad creciente: a tamaños grandes el salto entre
 * capas no se nota y el resultado se lee como un halo difuso. Cero dependencias
 * nuevas y cero coste de render (son Views estáticas, sin animación).
 */

const LAYERS = [1, 0.74, 0.5, 0.3];

function Blob({ size, color, style }) {
  return (
    <View style={[styles.blob, { width: size, height: size }, style]} pointerEvents="none">
      {LAYERS.map((scale, i) => {
        const dimension = size * scale;
        return (
          <View
            key={scale}
            style={{
              position: 'absolute',
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: color,
              // Las capas interiores suman opacidad, igual que un degradado radial
              opacity: 0.05 + i * 0.035,
            }}
          />
        );
      })}
    </View>
  );
}

export default function Aurora() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Blob size={420} color={colors.azure} style={{ top: -140, left: -120 }} />
      <Blob size={320} color={colors.sky} style={{ top: 220, right: -140 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  blob: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
