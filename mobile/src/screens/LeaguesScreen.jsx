import { View, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useApiRequest } from '../hooks/useApiRequest';
import { getLeagues, getMatches } from '../api/sports';
import { alpha, colors, fonts, radius } from '../theme';
import SportsScreen, { Seccion } from '../components/SportsScreen';
import DemoNotice from '../components/DemoNotice';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

/**
 * Tarjeta de competición con el recuento real de partidos que tiene en la base,
 * calculado a partir de la misma lista que se pide al API (no se inventa).
 */
function LeagueCard({ league, partidos, onPress }) {
  const enVivo = partidos.filter((m) => m.status === 'live').length;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${league.name}, ${partidos.length} partidos`}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.pulsada]}
    >
      <View style={styles.icono}>
        <Text style={styles.iconoTexto}>{league.icon}</Text>
      </View>

      <View style={styles.textos}>
        <Text style={styles.nombre} numberOfLines={1}>{league.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {league.country}
          {league.season ? ` · ${league.season}` : ''}
        </Text>
        <View style={styles.recuentos}>
          <Text style={styles.recuento}>
            {partidos.length} {partidos.length === 1 ? 'partido' : 'partidos'}
          </Text>
          {enVivo > 0 && (
            <View style={styles.vivo}>
              <View style={styles.punto} />
              <Text style={styles.vivoTexto}>{enVivo} en vivo</Text>
            </View>
          )}
        </View>
      </View>

      <ChevronRight size={18} color={colors.steel} />
    </Pressable>
  );
}

export default function LeaguesScreen({ navigation }) {
  const ligas = useApiRequest(() => getLeagues(), []);
  // Una sola petición de partidos: se agrupan en el cliente por competición,
  // en lugar de hacer una llamada por liga.
  const partidos = useApiRequest(() => getMatches(), []);

  const porLiga = (slug) => (partidos.data?.matches || []).filter((m) => m.league?.slug === slug);
  const cargando = ligas.loading || partidos.loading;

  return (
    <SportsScreen
      subtitulo="Ligas"
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={() => { ligas.reload(); partidos.reload(); }}
          tintColor={colors.azure}
          colors={[colors.azure]}
        />
      }
    >
      <Seccion etiqueta="Competiciones" titulo="Ligas y torneos" />

      <DemoNotice notice={ligas.data?.notice} />

      {ligas.loading ? (
        <LoadingState message="Cargando competiciones..." />
      ) : ligas.error ? (
        <ErrorState message={ligas.error} onRetry={ligas.reload} />
      ) : !ligas.data?.leagues?.length ? (
        <EmptyState message="Todavía no hay competiciones disponibles." />
      ) : (
        <View style={styles.lista}>
          {ligas.data.leagues.map((l) => (
            <LeagueCard
              key={l.slug}
              league={l}
              partidos={porLiga(l.slug)}
              onPress={() => navigation.navigate('Partidos', { leagueSlug: l.slug })}
            />
          ))}
        </View>
      )}
    </SportsScreen>
  );
}

const styles = StyleSheet.create({
  lista: { gap: 12 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 15,
  },
  pulsada: { borderColor: alpha.azure25 },
  icono: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha.azure10,
    borderWidth: 1,
    borderColor: alpha.azure25,
  },
  iconoTexto: { fontSize: 22 },
  textos: { flex: 1, gap: 3 },
  nombre: { fontFamily: fonts.displaySemi, fontSize: 16, color: colors.mist },
  meta: { fontFamily: fonts.body, fontSize: 12, color: colors.steel },
  recuentos: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 3 },
  recuento: { fontFamily: fonts.mono, fontSize: 11, color: colors.sky },
  vivo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  punto: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.live },
  vivoTexto: { fontFamily: fonts.monoMedium, fontSize: 11, color: colors.live },
});
