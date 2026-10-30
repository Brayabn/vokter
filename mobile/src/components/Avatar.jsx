import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Toda la gama es azul claro o blanco azulado: la inicial va en `ink` (negro),
// así que cada color tiene que ser lo bastante claro para leerse debajo.
const AVATAR_COLORS = ['#6FD3FF', '#A9E7FF', '#4F8DFF', '#CDEBFF', '#8AB6FF'];

function colorForName(name = '') {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// Avatar con la inicial del nombre; el color es estable para cada nombre.
export default function Avatar({ name = '', size = 44 }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colorForName(name) },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.38 }]}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { justifyContent: 'center', alignItems: 'center' },
  initial: { fontWeight: '800', color: colors.ink },
});
