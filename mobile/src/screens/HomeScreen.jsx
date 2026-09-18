import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import AiMatchWidget from '../components/AiMatchWidget';
import ExpertCard from '../components/ExpertCard';
import FadeInView from '../components/FadeInView';
import { LoadingState, ErrorState } from '../components/StateViews';
import { colors } from '../theme';

// Categorías y expertos destacados en una sola carga: un único estado de error/reintento.
async function fetchHomeData() {
  const [categoriesRes, expertsRes] = await Promise.all([api.get('/categories'), api.get('/experts')]);
  return {
    categories: categoriesRes.data.categories,
    topExperts: expertsRes.data.experts.slice(0, 4),
  };
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApiRequest(fetchHomeData, []);
  const categories = data?.categories || [];

  const hour = new Date().getHours();
  const greeting = user
    ? `${hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'}, ${user.name.split(' ')[0]} 👋`
    : '¿Qué estás buscando?';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <FadeInView>
          <Text style={styles.logo}>VØKTER</Text>
        </FadeInView>

        <FadeInView delay={60}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>
            Cuéntale a VOKTER AI qué necesitas y te conectamos con quien puede ayudarte.
          </Text>
        </FadeInView>

        <FadeInView delay={120}>
          <AiMatchWidget />
        </FadeInView>

        {error && <ErrorState message={error} onRetry={reload} />}

        {categories.length > 0 && (
          <FadeInView delay={180}>
            <Text style={styles.sectionTitle}>Explora por categoría</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.slug}
                  style={styles.categoryPill}
                  onPress={() => navigation.navigate('Explorar', { categorySlug: c.slug })}
                >
                  <Text style={styles.categoryIcon}>{c.icon}</Text>
                  <Text style={styles.categoryText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </FadeInView>
        )}

        {!error && (
          <FadeInView delay={240}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Expertos destacados</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Expertos')}>
                <Text style={styles.link}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <LoadingState />
            ) : (
              data.topExperts.map((e) => (
                <ExpertCard key={e.id} expert={e} onPress={() => navigation.navigate('ExpertProfile', { expert: e })} />
              ))
            )}
          </FadeInView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20, paddingBottom: 40 },
  logo: { color: colors.mist, fontSize: 22, fontWeight: '800', marginBottom: 20 },
  greeting: { color: colors.mist, fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.lavender, fontSize: 14, marginBottom: 24, lineHeight: 20 },
  sectionTitle: { color: colors.mist, fontSize: 17, fontWeight: '700', marginTop: 28, marginBottom: 14 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: colors.gold, fontSize: 13 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  categoryIcon: { fontSize: 14 },
  categoryText: { color: colors.mist, fontSize: 13 },
});
