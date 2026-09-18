import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { colors } from '../theme';
import ExpertCard from '../components/ExpertCard';
import FadeInView from '../components/FadeInView';

export default function ExpertsScreen() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  const fetchExperts = useCallback(() => {
    setLoading(true);
    const params = activeCategory ? { categorySlug: activeCategory } : {};
    api.get('/experts', { params })
      .then((res) => setExperts(res.data.experts))
      .catch(() => setExperts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  useEffect(() => { fetchExperts(); }, [fetchExperts]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Expertos</Text>
        <Text style={styles.subtitle}>Personas reales listas para ayudarte, organizadas por categoría.</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
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
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={experts}
          keyExtractor={(e) => String(e.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay expertos en esta categoría todavía.</Text>}
          renderItem={({ item, index }) => (
            <FadeInView delay={index * 60}>
              <ExpertCard expert={item} />
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
  title: { color: colors.mist, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.lavender, fontSize: 13, marginTop: 4 },
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
