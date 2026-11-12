import { Pressable, View, Text, StyleSheet } from 'react-native';
import { alpha, colors, fonts, radius } from '../theme';
import { formatOdd } from '../api/sports';

/**
 * Tarjeta de un tipo de mercado (1X2, más/menos goles...).
 *
 * `disponibles` y `ejemplo` los calcula el backend a partir de los encuentros
 * que existen de verdad en la base: aquí no se inventa ningún dato. Si un
 * mercado no tiene encuentros, se dice con todas las letras.
 */
export default function MarketCard({ market, onPress }) {
  const hayEjemplo = !!market.ejemplo;
  return (
    <Pressable
      onPress={hayEjemplo ? onPress : undefined}
      disabled={!hayEjemplo || !onPress}
      accessibilityRole={hayEjemplo && onPress ? 'button' : 'summary'}
      accessibilityLabel={`${market.name}. ${market.hint}. ${market.disponibles} partidos con este mercado`}
      style={({ pressed }) => [styles.tarjeta, pressed && hayEjemplo && styles.pulsada]}
    >
      <View style={styles.cabecera}>
        <Text style={styles.icono}>{market.icon}</Text>
        <View style={styles.titulos}>
          <Text style={styles.nombre}>{market.name}</Text>
          <Text style={styles.pista} numberOfLines={2}>{market.hint}</Text>
        </View>
      </View>

      {hayEjemplo ? (
        <View style={styles.ejemplo}>
          <Text style={styles.ejemploTitulo} numberOfLines={1}>
            {market.ejemplo.homeTeam} vs {market.ejemplo.awayTeam}
          </Text>
          <View style={styles.cuotas}>
            {market.ejemplo.odds.slice(0, 3).map((o) => (
              <View key={o.label} style={styles.cuota}>
                <Text style={styles.cuotaEtiqueta} numberOfLines={1}>{o.label}</Text>
                <Text style={styles.cuotaValor}>{formatOdd(o.value)}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.sinDatos}>Ningún partido ofrece este mercado por ahora.</Text>
      )}

      <Text style={styles.disponibles}>
        {market.disponibles === 0
          ? 'Sin partidos'
          : `${market.disponibles} ${market.disponibles === 1 ? 'partido' : 'partidos'}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },
  pulsada: { borderColor: alpha.azure25 },
  cabecera: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  icono: { fontSize: 22 },
  titulos: { flex: 1, gap: 3 },
  nombre: { fontFamily: fonts.displaySemi, fontSize: 15, color: colors.mist },
  pista: { fontFamily: fonts.body, fontSize: 12, color: colors.steel, lineHeight: 17 },

  ejemplo: { gap: 7, borderTopWidth: 1, borderTopColor: alpha.white5, paddingTop: 11 },
  ejemploTitulo: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.steel },
  cuotas: { flexDirection: 'row', gap: 8 },
  cuota: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: alpha.white5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 7,
  },
  cuotaEtiqueta: { fontFamily: fonts.body, fontSize: 10, color: colors.steel, textAlign: 'center' },
  cuotaValor: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.azure },

  sinDatos: { fontFamily: fonts.body, fontSize: 12, color: colors.steel, fontStyle: 'italic' },
  disponibles: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.8, color: colors.steel },
});
