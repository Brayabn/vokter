import { StyleSheet, Text, View } from 'react-native';
import { alpha, colors, fonts, kicker } from '../theme';
import GradientText from './GradientText';
import FadeInView from './FadeInView';

// Logotipo de texto de la web: V<sky>Ø</sky>KTER en Sora extrabold.
export function Logo({ size = 20 }) {
  return (
    <Text style={[styles.logo, { fontSize: size }]} accessibilityLabel="VØKTER">
      V<Text style={{ color: colors.sky }}>Ø</Text>KTER
    </Text>
  );
}

// "CATÁLOGO", "TU PANEL"...: font-mono uppercase tracking-[0.3em] text-sky.
export function Kicker({ children, style }) {
  return <Text style={[kicker, style]}>{children}</Text>;
}

// Píldora con borde sky ("✦ Pruébalo ahora" del landing).
export function Eyebrow({ children, icon: Icon }) {
  return (
    <View style={styles.eyebrow}>
      {Icon && <Icon size={13} color={colors.sky} strokeWidth={2} />}
      <Text style={styles.eyebrowText}>{children}</Text>
    </View>
  );
}

/**
 * Titular de página con una palabra en degradado, como la web:
 * "Todos los <span class="text-gradient-azure">artículos</span>".
 * `title` es el tramo normal, `accent` el tramo con degradado y `after` lo que va detrás (un icono).
 */
export function GradientTitle({ title, accent, after, size = 36, align = 'left', style }) {
  const textStyle = [styles.title, { fontSize: size, lineHeight: size * 1.12, textAlign: align }];
  return (
    <View style={[styles.titleRow, align === 'center' && { justifyContent: 'center' }, style]}>
      {!!title && <Text style={textStyle}>{title} </Text>}
      {!!accent && <GradientText style={textStyle}>{accent}</GradientText>}
      {after}
    </View>
  );
}

// Cabecera estándar de las páginas: kicker + titular + subtítulo, con la entrada de <Reveal>.
export function PageHeader({ kicker: kickerText, title, accent, subtitle, align = 'left', after, style }) {
  return (
    <FadeInView style={[{ marginBottom: 32 }, style]}>
      <Kicker style={align === 'center' && { textAlign: 'center' }}>{kickerText}</Kicker>
      <GradientTitle title={title} accent={accent} after={after} align={align} style={{ marginTop: 16 }} />
      {!!subtitle && <Text style={[styles.subtitle, align === 'center' && { textAlign: 'center' }]}>{subtitle}</Text>}
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  logo: { fontFamily: fonts.displayHeavy, color: colors.mist, letterSpacing: -0.4 },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: alpha.sky30,
    backgroundColor: alpha.sky10,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  eyebrowText: { fontFamily: fonts.mono, fontSize: 12, color: colors.sky },
  titleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' },
  title: { fontFamily: fonts.displayHeavy, color: colors.mist, letterSpacing: -0.9 },
  subtitle: { fontFamily: fonts.body, color: colors.steel, fontSize: 17, lineHeight: 26, marginTop: 16 },
});
