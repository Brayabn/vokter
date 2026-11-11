import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { alpha, colors, fonts } from '../theme';
import { Logo } from './Typography';

// Pie de las páginas: el Footer de la web. El enlace "Descargar la app móvil" no tiene
// sentido dentro de la app, así que en su lugar va la versión instalada.
export default function Footer() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: 40 + insets.bottom }]}>
      <Logo size={16} />
      <Text style={styles.tagline}>Todo lo que buscas, en una sola frase.</Text>
      <Text style={styles.version}>App Android · v{Constants.expoConfig?.version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 96,
    borderTopWidth: 1,
    borderTopColor: alpha.white10,
    backgroundColor: 'rgba(4,7,13,0.6)',
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 16,
  },
  tagline: { fontFamily: fonts.body, fontSize: 14, color: colors.steel },
  version: { fontFamily: fonts.mono, fontSize: 12, color: colors.sky },
});
