import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { colors } from '../theme';
import ContentCard from '../components/ContentCard';
import FadeInView from '../components/FadeInView';

export default function ExploreScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(route.params?.categorySlug || null);
  const [search, setSearch] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route.params?.categorySlug) {
      setActiveCategory(route.params.categorySlug);
    }
  }, [route.params?.categorySlug]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  const fetchContents = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeCategory) params.categorySlug = activeCategory;
    api.get('/contents', { params })
      .then((res) => setContents(res.data.contents))
      .catch(() => setContents([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  useEffect(() => { fetchContents(); }, [fetchContents]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <TextInput
          style={styles.search}
          placeholder="Buscar por tema o habilidad..."
          placeholderTextColor={colors.lavender}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={fetchContents}
          returnKeyType="search"
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
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
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={contents}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No encontramos resultados.</Text>}
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
  title: { color: colors.mist, fontSize: 24, fontWeight: '800', marginBottom: 16 },
  search: {
    backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 12,
    color: colors.mist, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  chip: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
  },
  chipActive: { borderColor: colors.gold, backgroundColor: 'rgba(232,176,75,0.1)' },
  chipText: { color: colors.lavender, fontSize: 13 },
  chipTextActive: { color: colors.gold },
  list: { padding: 20, paddingTop: 16 },
  empty: { color: colors.lavender, textAlign: 'center', marginTop: 40 },
});
