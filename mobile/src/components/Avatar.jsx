import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const AVATAR_COLORS = ['#E8B04B', '#7DD3FC', '#C4B5FD', '#86EFAC', '#FDA4AF'];

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
