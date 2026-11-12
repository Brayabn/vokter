import { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';
import { alpha, colors, fonts, glow, radius } from '../theme';

/**
 * Botones de la web, con la misma jerarquía:
 *  - primary: pildora azul electrico + resplandor (accion principal). Encima va
 *             `onAzure` (blanco puro): con `mist` el contraste caeria a 4.08:1,
 *             por debajo del minimo AA. Con blanco da 4.68:1.
 *  - ghost:   borde white/15 sobre white/5 (acción secundaria)
 *  - light:   bg-mist text-ink (la llamada "Descargar app" del landing)
 *  - outline: borde azure/60 con texto sky ("Reintentar")
 *  - glass:   píldora de vidrio del footer cinemático
 * El hover:scale-105 / active:scale-95 de la web se traduce en un hundimiento al tocar.
 */
const VARIANTS = {
  primary: { bg: colors.azure, pressedBg: colors.azureDeep, border: colors.azure, text: colors.onAzure, glow: true },
  ghost: { bg: alpha.white5, pressedBg: alpha.white10, border: alpha.white15, text: colors.mist },
  light: { bg: colors.mist, pressedBg: '#FFFFFF', border: colors.mist, text: colors.ink },
  outline: { bg: 'transparent', pressedBg: alpha.azure10, border: alpha.azure60, text: colors.sky },
  glass: { bg: 'rgba(232,240,252,0.06)', pressedBg: 'rgba(232,240,252,0.12)', border: 'rgba(232,240,252,0.12)', text: colors.mist },
};

const SIZES = {
  lg: { paddingHorizontal: 28, paddingVertical: 16, fontSize: 15, iconSize: 16 },
  md: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 14, iconSize: 16 },
  sm: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 13, iconSize: 14 },
  xs: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12, iconSize: 12 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  iconPosition = 'right',
  iconColor,
  textColor,
  loading = false,
  disabled = false,
  block = false,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const scale = useRef(new Animated.Value(1)).current;
  const spring = (toValue) => Animated.spring(scale, { toValue, speed: 30, bounciness: 6, useNativeDriver: true }).start();
  const color = textColor || v.text;
  const iconNode = Icon && !loading ? <Icon size={s.iconSize} color={iconColor || color} strokeWidth={2} /> : null;

  return (
    <Animated.View style={[block && { alignSelf: 'stretch' }, !block && { alignSelf: 'flex-start' }, { transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={() => spring(0.95)}
        onPressOut={() => spring(1)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        style={({ pressed }) => [
          styles.base,
          {
            backgroundColor: pressed ? v.pressedBg : v.bg,
            borderColor: v.border,
            paddingHorizontal: s.paddingHorizontal,
            paddingVertical: s.paddingVertical,
          },
          v.glow && glow,
          (disabled || loading) && { opacity: 0.6 },
        ]}
      >
        {iconPosition === 'left' && iconNode}
        {loading && <ActivityIndicator size="small" color={color} />}
        <Text style={[styles.label, { color, fontSize: s.fontSize }, textStyle]}>{label}</Text>
        {iconPosition === 'right' && iconNode}
      </Pressable>
    </Animated.View>
  );
}

// Enlace de texto en `sky` con icono opcional ("Ver todo el catálogo →").
export function TextLink({ label, onPress, icon: Icon, size = 14, style, color = colors.sky }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" hitSlop={8} style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }, style]}>
      <Text style={[styles.linkText, { color, fontSize: size }]}>{label}</Text>
      {Icon && <Icon size={size + 2} color={color} strokeWidth={2} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: { fontFamily: fonts.bodySemi, textAlign: 'center' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  linkText: { fontFamily: fonts.bodyMedium },
});
