import { Pressable, View, Text, StyleSheet } from 'react-native';
import { alpha, colors, fonts, radius } from '../theme';
import { formatOdd } from '../api/sports';

/**
 * Una opción de mercado con su cuota.
 *
 * Es informativa: VOKTER no acepta apuestas ni pagos. Al tocarla no se juega
 * nada; solo avisa de que la cuota es demostrativa. Por eso no se presenta
 * como un botón de apuesta ni usa verbos de acción.
 */
export default function OddButton({ odd, onPress, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      accessibilityRole="button"
      accessibilityLabel={`${odd.description || odd.label}. Cuota demostrativa ${formatOdd(odd.value)}`}
      style={({ pressed }) => [
        styles.caja,
        pressed && !disabled && styles.pulsada,
        disabled && styles.inactiva,
      ]}
    >
      <Text style={styles.etiqueta} numberOfLines={1}>{odd.label}</Text>
      <Text style={styles.cuota}>{formatOdd(odd.value)}</Text>
    </Pressable>
  );
}

/** Fila de opciones de un mercado. Se reparten el ancho por igual. */
export function OddRow({ odds, onPressOdd, disabled }) {
  return (
    <View style={styles.fila}>
      {odds.map((o) => (
        <View key={o.id ?? o.label} style={styles.celda}>
          <OddButton odd={o} onPress={onPressOdd ? () => onPressOdd(o) : undefined} disabled={disabled} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 8 },
  celda: { flex: 1 },
  caja: {
    backgroundColor: alpha.white5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    // 44 de alto mínimo: objetivo táctil accesible en Android.
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pulsada: { backgroundColor: alpha.azure15, borderColor: alpha.sky40 },
  inactiva: { opacity: 0.5 },
  etiqueta: { fontFamily: fonts.body, fontSize: 11, color: colors.steel, textAlign: 'center' },
  cuota: { fontFamily: fonts.monoBold, fontSize: 15, color: colors.azure },
});
