import { View, Text, StyleSheet } from 'react-native';
import { ArrowRight, Hand } from 'lucide-react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { goTo } from '../navigation/goTo';
import AiMatchWidget from '../components/AiMatchWidget';
import ContentCard from '../components/ContentCard';
import FadeInView from '../components/FadeInView';
import GlowCard from '../components/GlowCard';
import { Page } from '../components/Screen';
import { LoadingState, ErrorState } from '../components/StateViews';
import { TextLink } from '../components/Buttons';
import { Kicker, PageHeader } from '../components/Typography';
import { colors, fonts } from '../theme';

// Panel del usuario (frontend/src/pages/Dashboard.jsx): saludo, VOKTER AI y los artículos
// mejor valorados.
export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { data: contents, loading, error, reload } = useApiRequest(
    () => api.get('/contents', { params: { sort: 'rating' } }).then((res) => res.data.contents.slice(0, 3)),
    []
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <Page>
      <PageHeader
        kicker="Tu panel"
        title={`${greeting},`}
        accent={user?.name.split(' ')[0]}
        after={<Hand size={32} color={colors.sky} style={{ marginLeft: 12, marginBottom: 4 }} />}
        subtitle="¿Qué estás buscando hoy?"
      />

      <GlowCard glowColor="deep" style={{ padding: 24 }}>
        <AiMatchWidget variant="hero" />
      </GlowCard>

      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <Kicker>Recomendados</Kicker>
          <Text style={styles.h2}>Los artículos mejor valorados</Text>
        </View>
        <TextLink label="Ver todo" icon={ArrowRight} onPress={() => goTo(navigation, 'Catálogo')} />
      </View>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <View style={{ gap: 20 }}>
          {contents.map((c, i) => (
            <FadeInView key={c.id} delay={i * 80}>
              <ContentCard content={c} onPress={() => navigation.navigate('ContentDetail', { id: c.id })} />
            </FadeInView>
          ))}
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginTop: 64, marginBottom: 24 },
  h2: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.6, color: colors.mist, marginTop: 12 },
});
