import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import Aurora from '../components/Aurora';
import { colors, hairline, radius, TAB_BAR_SPACE } from '../theme';
import ContentCard from '../components/ContentCard';
import FadeInView from '../components/FadeInView';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export default function ExploreScreen({ navigation, route }) {
  const [activeCategory, setActiveCategory] = useState(route.params?.categorySlug || null);
  const [search, setSearch] = useState('');
  // La petición se hace cuando el usuario deja de escribir, no en cada tecla.
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  useEffect(() => {
    if (route.params?.categorySlug) {
      setActiveCategory(route.params.categorySlug);
    }
  }, [route.params?.categorySlug]);

  const { data: categories } = useApiRequest(
    () => api.get('/categories').then((res) => res.data.categories),
    []
  );

  const { data: contents, loading, error, reload } = useApiRequest(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory) params.categorySlug = activeCategory;
    return api.get('/contents', { params }).then((res) => res.data.contents);
  }, [debouncedSearch, activeCategory]);

  const emptyMessage = debouncedSearch
    ? `No encontramos artículos para "${debouncedSearch}".`
    : 'Todavía no hay artículos en esta categoría.';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Aurora />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CATÁLOGO</Text>
        <Text style={styles.title}>Todos los artículos</Text>
        <TextInput
          style={styles.search}
          placeholder="Buscar una chaqueta, audífonos, una silla..."
          placeholderTextColor={colors.steel}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories || []}
          keyExtractor={(c) => c.slug}
          style={{ marginTop: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, activeCategory === item.slug && styles.chipActive]}
              onPress={() => setActiveCategory(activeCategory === item.slug ? null : item.slug)}
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
          data={contents}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<EmptyState message={emptyMessage} />}
          renderItem={({ item, index }) => (
            <FadeInView delay={index * 50}>
              <ContentCard content={item} onPress={() => navigation.navigate('ContentDetail', { id: item.id })} />
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
  title: { color: colors.mist, fontSize: 26, fontWeight: '800', marginBottom: 16 },
  search: {
    backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 12,
    color: colors.mist, borderWidth: 1, borderColor: hairline,
  },
  chip: {
    borderWidth: 1, borderColor: hairline, borderRadius: radius.pill,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
  },
  chipActive: { borderColor: colors.sky, backgroundColor: 'rgba(111,211,255,0.12)' },
  chipText: { color: colors.steel, fontSize: 13 },
  chipTextActive: { color: colors.sky },
  list: { padding: 20, paddingTop: 16, paddingBottom: TAB_BAR_SPACE },
});
