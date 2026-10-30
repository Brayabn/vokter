import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import { colors, hairline, radius } from '../theme';
import Avatar from '../components/Avatar';
import ContentCard from '../components/ContentCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

// GET /experts/:id devuelve { expert, contents } en una sola llamada.
async function fetchExpertProfile(expertId) {
  const res = await api.get(`/experts/${expertId}`);
  return res.data;
}

export default function ExpertProfileScreen({ route, navigation }) {
  // Datos parciales recibidos al navegar (tarjeta, resultado de VOKTER AI o autor):
  // se muestran de inmediato mientras se completa el perfil.
  const initialExpert = route.params.expert;
  const { data, loading, error, reload } = useApiRequest(
    () => fetchExpertProfile(initialExpert.id),
    [initialExpert.id]
  );

  const expert = { ...initialExpert, ...(data?.expert || {}) };
  // skills de la marca = sus líneas de producto (ver backend/src/utils/seedData.js)
  const lines = (expert.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar name={expert.name} size={72} />
          <Text style={styles.label}>MARCA DE LA TIENDA</Text>
          <Text style={styles.name}>{expert.name}</Text>
          {expert.rating != null && <Text style={styles.rating}>★ {Number(expert.rating).toFixed(1)}</Text>}
        </View>

        {!!expert.bio && <Text style={styles.bio}>{expert.bio}</Text>}

        {lines.length > 0 && (
          <View style={styles.linesRow}>
            {lines.map((s) => (
              <View key={s} style={styles.lineChip}>
                <Text style={styles.lineText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.pendingBox}>
          <Text style={styles.pendingTitle}>Compra en línea — próximamente</Text>
          <Text style={styles.pendingText}>
            Por ahora puedes recorrer su catálogo y guardar artículos en tus favoritos.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Artículos de la marca</Text>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data.contents.length === 0 ? (
          <EmptyState message="Esta marca todavía no tiene artículos en el catálogo." />
        ) : (
          data.contents.map((c) => (
            <ContentCard key={c.id} content={c} onPress={() => navigation.push('ContentDetail', { id: c.id })} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 16, gap: 6 },
  label: { color: colors.sky, fontSize: 10, letterSpacing: 2, fontWeight: '700', marginTop: 10 },
  name: { color: colors.mist, fontSize: 24, fontWeight: '800', marginTop: 2, textAlign: 'center' },
  rating: { color: colors.sky, fontSize: 13 },
  bio: { color: colors.steel, fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 16 },
  linesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 20 },
  lineChip: { backgroundColor: colors.surface2, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  lineText: { color: colors.steel, fontSize: 12 },
  pendingBox: {
    borderWidth: 1, borderColor: hairline, backgroundColor: 'rgba(30,107,255,0.10)',
    borderRadius: radius.md, padding: 14, marginBottom: 24,
  },
  pendingTitle: { color: colors.sky, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  pendingText: { color: colors.steel, fontSize: 12, lineHeight: 18 },
  sectionTitle: { color: colors.mist, fontSize: 17, fontWeight: '700', marginBottom: 12 },
});
