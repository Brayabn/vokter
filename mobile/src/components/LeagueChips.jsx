import { ScrollView, Pressable, View, Text, StyleSheet } from 'react-native';
import { alpha, colors, fonts, radius, PAGE_PADDING } from '../theme';

/**
 * Carrusel horizontal de competiciones, con "Todas" al principio.
 * Equivale a CategoryChips del catálogo, pero para ligas.
 */
export default function LeagueChips({ leagues = [], activa = '', onSelect }) {
  const items = [{ slug: '', name: 'Todas', icon: '⚽' }, ...leagues];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.fila}
      // El carrusel sangra hasta el borde y recupera el margen por dentro, para
      // que la última tarjeta no quede cortada contra el filo de la pantalla.
      style={styles.scroll}
    >
      {items.map((l) => {
        const seleccionada = activa === l.slug;
        return (
          <Pressable
            key={l.slug || 'todas'}
            onPress={() => onSelect?.(l.slug)}
            accessibilityRole="button"
            accessibilityState={{ selected: seleccionada }}
            accessibilityLabel={l.name}
            style={({ pressed }) => [
              styles.chip,
              seleccionada && styles.chipActivo,
              pressed && !seleccionada && styles.chipPulsado,
            ]}
          >
            <Text style={styles.icono}>{l.icon}</Text>
            <View style={styles.textos}>
              <Text style={[styles.nombre, seleccionada && styles.nombreActivo]} numberOfLines={1}>
                {l.name}
              </Text>
              {!!l.season && (
                <Text style={styles.temporada} numberOfLines={1}>{l.season}</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -PAGE_PADDING },
  fila: { flexDirection: 'row', gap: 10, paddingHorizontal: PAGE_PADDING, paddingVertical: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 46,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  chipActivo: { borderColor: colors.azure, backgroundColor: alpha.azure10 },
  chipPulsado: { borderColor: alpha.white25 },
  icono: { fontSize: 17 },
  textos: { maxWidth: 150 },
  nombre: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.mist },
  nombreActivo: { color: colors.sky },
  temporada: { fontFamily: fonts.mono, fontSize: 10, color: colors.steel, marginTop: 1 },
});
