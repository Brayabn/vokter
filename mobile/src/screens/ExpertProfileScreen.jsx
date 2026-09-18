import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import { colors } from '../theme';
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
  const skills = (expert.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar name={expert.name} size={72} />
          <Text style={styles.name}>{expert.name}</Text>
          {expert.rating != null && <Text style={styles.rating}>★ {Number(expert.rating).toFixed(1)}</Text>}
        </View>

        {!!expert.bio && <Text style={styles.bio}>{expert.bio}</Text>}

        {skills.length > 0 && (
          <View style={styles.skillsRow}>
            {skills.map((s) => (
              <View key={s} style={styles.skillChip}>
                <Text style={styles.skillText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.pendingBox}>
          <Text style={styles.pendingTitle}>Contacto directo — próximamente</Text>
          <Text style={styles.pendingText}>
            Por ahora puedes explorar sus contenidos y guardarlos en favoritos.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Contenidos publicados</Text>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data.contents.length === 0 ? (
          <EmptyState message="Este experto aún no ha publicado contenidos." />
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
  name: { color: colors.mist, fontSize: 22, fontWeight: '800', marginTop: 8, textAlign: 'center' },
  rating: { color: colors.success, fontSize: 13 },
  bio: { color: colors.lavender, fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 16 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 20 },
  skillChip: { backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  skillText: { color: colors.lavender, fontSize: 12 },
  pendingBox: {
    borderWidth: 1, borderColor: 'rgba(232,176,75,0.25)', backgroundColor: 'rgba(232,176,75,0.06)',
    borderRadius: 14, padding: 14, marginBottom: 24,
  },
  pendingTitle: { color: colors.gold, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  pendingText: { color: colors.lavender, fontSize: 12, lineHeight: 18 },
  sectionTitle: { color: colors.mist, fontSize: 17, fontWeight: '700', marginBottom: 12 },
});
