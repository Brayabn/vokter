import { View, Text, StyleSheet } from 'react-native';
import { alpha, fonts } from '../theme';

/**
 * Insignia circular de un equipo: iniciales sobre su color.
 *
 * No se usan escudos reales a propósito: son marcas registradas de los clubes y
 * obligarían a depender de imágenes externas que pueden faltar o caducar. Las
 * iniciales y el color vienen del backend.
 */
export default function TeamBadge({ team, size = 40 }) {
  const iniciales = (team?.initials || team?.name || '?').slice(0, 3).toUpperCase();
  return (
    <View
      style={[
        styles.circulo,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: team?.color || '#1E6BFF' },
      ]}
      accessibilityLabel={team?.name}
    >
      <Text style={[styles.texto, { fontSize: size * 0.32 }]} numberOfLines={1}>
        {iniciales}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: alpha.white15,
  },
  // Texto blanco: los colores de equipo del backend son todos oscuros o medios.
  texto: { fontFamily: fonts.displayHeavy, color: '#FFFFFF', letterSpacing: 0.3 },
});
