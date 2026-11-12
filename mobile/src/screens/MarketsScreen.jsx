import { View, StyleSheet, RefreshControl } from 'react-native';
import { useApiRequest } from '../hooks/useApiRequest';
import { getMarkets } from '../api/sports';
import { colors } from '../theme';
import SportsScreen, { Seccion } from '../components/SportsScreen';
import DemoNotice from '../components/DemoNotice';
import MarketCard from '../components/MarketCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

/**
 * Catálogo de tipos de mercado. Cada tarjeta trae un ejemplo tomado de un
 * partido que existe en la base; al tocarla se abre ese partido. Los mercados
 * sin ningún encuentro lo dicen y no son pulsables.
 */
export default function MarketsScreen({ navigation }) {
  const mercados = useApiRequest(() => getMarkets(), []);
  const lista = mercados.data?.markets || [];

  return (
    <SportsScreen
      subtitulo="Mercados"
      refreshControl={
        <RefreshControl refreshing={mercados.loading} onRefresh={mercados.reload} tintColor={colors.azure} colors={[colors.azure]} />
      }
    >
      <Seccion etiqueta="Tipos de apuesta" titulo="Mercados populares" />

      <DemoNotice notice={mercados.data?.notice} />

      {mercados.loading ? (
        <LoadingState message="Cargando mercados..." />
      ) : mercados.error ? (
        <ErrorState message={mercados.error} onRetry={mercados.reload} />
      ) : lista.length === 0 ? (
        <EmptyState message="Todavía no hay mercados disponibles." />
      ) : (
        <View style={styles.lista}>
          {lista.map((m) => (
            <MarketCard
              key={m.type}
              market={m}
              onPress={() => navigation.navigate('MatchDetail', { id: m.ejemplo.matchId })}
            />
          ))}
        </View>
      )}
    </SportsScreen>
  );
}

const styles = StyleSheet.create({
  lista: { gap: 12 },
});
