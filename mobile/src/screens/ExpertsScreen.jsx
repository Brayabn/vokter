import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import Aurora from '../components/Aurora';
import { colors, hairline, radius, TAB_BAR_SPACE } from '../theme';
import ExpertCard from '../components/ExpertCard';
import FadeInView from '../components/FadeInView';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export default function ExpertsScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const { data: categories } = useApiRequest(
    () => api.get('/categories').then((res) => res.data.categories),
    []
  );

  const { data: experts, loading, error, reload } = useApiRequest(() => {
    const params = activeCategory ? { categorySlug: activeCategory } : {};
    return api.get('/experts', { params }).then((res) => res.data.experts);
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Aurora />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MARCAS</Text>
        <Text style={styles.title}>Quién vende en VØKTER</Text>
        <Text style={styles.subtitle}>Diez marcas con catálogo propio, filtradas por categoría.</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories || []}
          keyExtractor={(c) => c.slug}
          style={{ marginTop: 14 }}
          ListHeaderComponent={
            <TouchableOpacity
              style={[styles.chip, !activeCategory && styles.chipActive]}
              onPress={() => setActiveCategory(null)}
            >
              <Text style={[styles.chipText, !activeCategory && styles.chipTextActive]}>Todos</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, activeCategory === item.slug && styles.chipActive]}
              onPress={() => setActiveCategory(item.slug)}
            >
              <Text style={[styles.chipText, activeCategory === item.slug && styles.chipTextActive]}>
                {item.icon} {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={experts}
          keyExtractor={(e) => String(e.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState message="Ninguna marca tiene artículos en esta categoría todavía." />}
          renderItem={({ item, index }) => (
            <FadeInView delay={index * 60}>
              <ExpertCard expert={item} onPress={() => navigation.navigate('ExpertProfile', { expert: item })} />
            </FadeInView>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  header: { paddingHorizontal: 20, paddingTop: 16 },
  eyebrow: { color: colors.sky, fontSize: 10, letterSpacing: 3, fontWeight: '700', marginBottom: 6 },
  title: { color: colors.mist, fontSize: 26, fontWeight: '800' },
  subtitle: { color: colors.steel, fontSize: 13, marginTop: 6, lineHeight: 19 },
  chip: {
    borderWidth: 1, borderColor: hairline, borderRadius: radius.pill,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
  },
  chipActive: { borderColor: colors.sky, backgroundColor: 'rgba(111,211,255,0.12)' },
  chipText: { color: colors.steel, fontSize: 13 },
  chipTextActive: { color: colors.sky },
  list: { padding: 20, paddingTop: 16, paddingBottom: TAB_BAR_SPACE },
});
