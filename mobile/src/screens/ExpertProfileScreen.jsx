import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { ShoppingBag, Star } from 'lucide-react-native';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import Avatar from '../components/Avatar';
import ContentCard from '../components/ContentCard';
import FadeInView from '../components/FadeInView';
import GlowCard from '../components/GlowCard';
import Halo from '../components/Halo';
import { Page } from '../components/Screen';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { GradientTitle, Kicker } from '../components/Typography';
import { alpha, colors, fonts, radius } from '../theme';

// GET /experts/:id devuelve { expert, contents } en una sola llamada.
async function fetchExpertProfile(expertId) {
  const res = await api.get(`/experts/${expertId}`);
  return res.data;
}

// Página de una marca (frontend/src/pages/ExpertProfile.jsx). En el modelo de datos la marca
// es un User con role 'expert', de ahí el nombre de la pantalla.
export default function ExpertProfileScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
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
    <Page>
      <Halo width={Math.min(width, 576)} height={288} stops={[[0, '#1E6BFF', 0.14], [1, '#1E6BFF', 0]]} style={{ top: -48, left: (width - Math.min(width, 576)) / 2 - 24 }} />

      <FadeInView style={styles.header}>
        <View style={styles.avatarWrap}>
          <Halo width={150} stops={[[0, '#1E6BFF', 0.35], [1, '#1E6BFF', 0]]} style={{ top: -13, left: -13 }} />
          <Avatar name={expert.name} size={112} ring="rgba(111,211,255,0.6)" />
        </View>
        <Kicker style={{ textAlign: 'center' }}>Marca de la tienda</Kicker>
        <Text style={styles.name}>{expert.name}</Text>
        {expert.rating != null && (
          <View style={styles.ratingRow}>
            <Star size={16} color={colors.sky} fill={colors.sky} />
            <Text style={styles.rating}>{Number(expert.rating).toFixed(1)}</Text>
          </View>
        )}
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
      </FadeInView>

      <FadeInView delay={100} style={{ marginBottom: 56 }}>
        <GlowCard style={{ padding: 24 }}>
          <View style={styles.pending}>
            <View style={styles.pendingIcon}>
              <ShoppingBag size={20} color={colors.sky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>Compra en línea — próximamente</Text>
              <Text style={styles.pendingText}>Por ahora puedes recorrer su catálogo y guardar artículos en tus favoritos.</Text>
            </View>
          </View>
        </GlowCard>
      </FadeInView>

      <FadeInView delay={160} style={{ marginBottom: 32 }}>
        <Kicker>Catálogo</Kicker>
        <GradientTitle title="Artículos de la" accent="marca" size={26} style={{ marginTop: 8 }} />
      </FadeInView>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.contents.length === 0 ? (
        <EmptyState message="Esta marca todavía no tiene artículos en el catálogo." />
      ) : (
        <View style={{ gap: 20 }}>
          {data.contents.map((c, i) => (
            <FadeInView key={c.id} delay={Math.min(i, 6) * 60}>
              <ContentCard content={{ ...c, author: expert }} onPress={() => navigation.push('ContentDetail', { id: c.id })} />
            </FadeInView>
          ))}
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 48 },
  avatarWrap: { marginBottom: 32 },
  name: { fontFamily: fonts.displayHeavy, color: colors.mist, fontSize: 36, lineHeight: 42, letterSpacing: -0.9, marginTop: 12, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  rating: { fontFamily: fonts.mono, color: colors.sky, fontSize: 14 },
  bio: { fontFamily: fonts.body, color: colors.steel, fontSize: 18, lineHeight: 28, textAlign: 'center', marginTop: 16 },
  linesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 20 },
  lineChip: { backgroundColor: 'rgba(17,28,45,0.8)', borderWidth: 1, borderColor: alpha.white10, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  lineText: { fontFamily: fonts.bodyMedium, color: colors.mist, fontSize: 12 },
  pending: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  pendingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: alpha.sky30,
    backgroundColor: alpha.azure15,
  },
  pendingTitle: { fontFamily: fonts.bodySemi, color: colors.sky, fontSize: 14 },
  pendingText: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, lineHeight: 20, marginTop: 4 },
});
