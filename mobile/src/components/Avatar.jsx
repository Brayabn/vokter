import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/**
 * Avatar con la inicial del nombre, como el de la ficha de marca de la web:
 * círculo azure con texto mist, anillo sky separado por un hueco negro
 * (ring-2 ring-sky/40 ring-offset-4 ring-offset-ink) y resplandor azul.
 */
export default function Avatar({ name = '', size = 56, ring = 'rgba(111,211,255,0.4)' }) {
  const gap = size >= 80 ? 4 : 3;
  return (
    <View
      style={[
        styles.ring,
        { width: size + (gap + 2) * 2, height: size + (gap + 2) * 2, borderRadius: size, borderColor: ring },
      ]}
    >
      <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{name.charAt(0).toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.azure,
    boxShadow: '0px 0px 30px -8px rgba(30,107,255,0.9)',
  },
  initial: { fontFamily: fonts.displayHeavy, color: colors.mist },
});
