import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { alpha, colors, fonts, radius } from '../theme';

/**
 * Aviso de datos de demostración.
 *
 * VOKTER no tiene proveedor deportivo ni casa de apuestas: marcadores, minutos
 * y cuotas son ficticios. Este aviso acompaña SIEMPRE a esos datos para que no
 * puedan confundirse con información real. El texto lo envía el propio API
 * (campo `notice`), así que servidor y app no pueden contradecirse.
 */
export default function DemoNotice({ notice, compact = false }) {
  if (!notice) return null;
  return (
    <View
      style={[styles.caja, compact && styles.compacta]}
      accessibilityRole="alert"
      accessibilityLabel={notice}
    >
      <Info size={compact ? 13 : 15} color={colors.sky} style={styles.icono} />
      <Text style={[styles.texto, compact && styles.textoCompacto]}>{notice}</Text>
    </View>
  );
}

/** Etiqueta corta para poner dentro de una tarjeta. */
export function DemoTag() {
  return (
    <View style={styles.etiqueta}>
      <Text style={styles.etiquetaTexto}>DEMO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: alpha.azure10,
    borderWidth: 1,
    borderColor: alpha.azure25,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  compacta: { paddingHorizontal: 12, paddingVertical: 9, gap: 8 },
  icono: { marginTop: 1 },
  texto: { flex: 1, fontFamily: fonts.body, color: colors.sky, fontSize: 12, lineHeight: 18 },
  textoCompacto: { fontSize: 11, lineHeight: 16 },
  etiqueta: {
    backgroundColor: alpha.azure15,
    borderWidth: 1,
    borderColor: alpha.azure25,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  etiquetaTexto: {
    fontFamily: fonts.monoSemi,
    fontSize: 9,
    letterSpacing: 1.1,
    color: colors.sky,
  },
});
