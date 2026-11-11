import { Pressable, StyleSheet, Text, View } from 'react-native';
import { alpha, colors, fonts } from '../theme';

// Filtros por categoría (los botones redondos del catálogo web). `allLabel` añade la opción
// "Todos" delante; sin ella, tocar la categoría activa la desactiva, como en la web.
export default function CategoryChips({ categories, active, onChange, allLabel }) {
  const options = [...(allLabel ? [{ slug: null, name: allLabel }] : []), ...(categories || [])];
  return (
    <View style={styles.row}>
      {options.map((cat) => {
        const selected = active === cat.slug;
        return (
          <Pressable
            key={cat.slug ?? 'all'}
            onPress={() => onChange(cat.slug === null ? null : selected && !allLabel ? null : cat.slug)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => [styles.chip, selected && styles.chipActive, pressed && !selected && styles.chipPressed]}
          >
            <Text style={[styles.text, selected && styles.textActive]}>
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 40 },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: alpha.white10, paddingHorizontal: 16, paddingVertical: 8 },
  chipActive: { borderColor: colors.azure, backgroundColor: alpha.azure15 },
  chipPressed: { borderColor: alpha.white25 },
  text: { fontFamily: fonts.body, fontSize: 14, color: colors.steel },
  textActive: { color: colors.sky },
});
