import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import AiMatchWidget from '../components/AiMatchWidget';
import Aurora from '../components/Aurora';
import ExpertCard from '../components/ExpertCard';
import FadeInView from '../components/FadeInView';
import PressableCard from '../components/PressableCard';
import { LoadingState, ErrorState } from '../components/StateViews';
import { colors, hairline, radius, TAB_BAR_SPACE } from '../theme';

// Categorías y marcas destacadas en una sola carga: un único estado de error/reintento.
async function fetchHomeData() {
  const [categoriesRes, brandsRes] = await Promise.all([api.get('/categories'), api.get('/experts')]);
  return {
    categories: categoriesRes.data.categories,
    topBrands: brandsRes.data.experts.slice(0, 4),
  };
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApiRequest(fetchHomeData, []);
  const categories = data?.categories || [];

  const hour = new Date().getHours();
  const greeting = user
    ? `${hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'}, ${user.name.split(' ')[0]}`
    : 'Todo lo que buscas,';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Aurora />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInView>
          <Text style={styles.eyebrow}>TIENDA MULTIMARCA</Text>
          <Text style={styles.logo}>
            V<Text style={styles.logoAccent}>Ø</Text>KTER
          </Text>
        </FadeInView>

        <FadeInView delay={60}>
          <Text style={styles.greeting}>{greeting}</Text>
          {!user && <Text style={styles.greetingAccent}>en una sola frase.</Text>}
          <Text style={styles.subtitle}>
            Describe el artículo que buscas y VOKTER AI te lleva a la marca que lo vende.
          </Text>
        </FadeInView>

        <FadeInView delay={120}>
          <AiMatchWidget />
        </FadeInView>

        {error && <ErrorState message={error} onRetry={reload} />}

        {categories.length > 0 && (
          <FadeInView delay={180}>
            <Text style={styles.sectionTitle}>Compra por categoría</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((c) => (
                <PressableCard
                  key={c.slug}
                  style={styles.categoryTile}
                  onPress={() => navigation.navigate('Catálogo', { categorySlug: c.slug })}
                >
                  <Text style={styles.categoryIcon}>{c.icon}</Text>
                  <Text style={styles.categoryText}>{c.name}</Text>
                </PressableCard>
              ))}
            </View>
          </FadeInView>
        )}

        {!error && (
          <FadeInView delay={240}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Marcas de la tienda</Text>
              <Text style={styles.link} onPress={() => navigation.navigate('Marcas')}>Ver todas</Text>
            </View>
            {loading ? (
              <LoadingState />
            ) : (
              data.topBrands.map((b) => (
                <ExpertCard key={b.id} expert={b} onPress={() => navigation.navigate('ExpertProfile', { expert: b })} />
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
  content: { padding: 20, paddingBottom: TAB_BAR_SPACE },
  eyebrow: { color: colors.sky, fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  logo: { color: colors.mist, fontSize: 22, fontWeight: '800', letterSpacing: 1, marginTop: 6, marginBottom: 24 },
  logoAccent: { color: colors.sky },
  greeting: { color: colors.mist, fontSize: 30, fontWeight: '800', lineHeight: 36 },
  greetingAccent: { color: colors.sky, fontSize: 30, fontWeight: '800', lineHeight: 36 },
  subtitle: { color: colors.steel, fontSize: 14, marginTop: 10, marginBottom: 22, lineHeight: 20 },
  sectionTitle: { color: colors.mist, fontSize: 17, fontWeight: '700', marginTop: 30, marginBottom: 14 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: colors.sky, fontSize: 13, marginTop: 30, marginBottom: 14 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  // Dos columnas: 48% deja el hueco del gap sin depender de Dimensions
  categoryTile: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: hairline,
    paddingVertical: 18,
    paddingHorizontal: 14,
    gap: 8,
  },
  categoryIcon: { fontSize: 24 },
  categoryText: { color: colors.mist, fontSize: 14, fontWeight: '600' },
});
