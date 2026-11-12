import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useApiRequest } from '../hooks/useApiRequest';
import { getMatch, ESTADOS, formatKickoff } from '../api/sports';
import { alpha, colors, fonts, radius } from '../theme';
import SportsScreen from '../components/SportsScreen';
import DemoNotice from '../components/DemoNotice';
import TeamBadge from '../components/TeamBadge';
import { OddRow } from '../components/OddButton';
import { LoadingState, ErrorState } from '../components/StateViews';

/** Marcador grande o la hora de inicio, según el estado del encuentro. */
function Marcador({ match }) {
  const enJuegoOTerminado = match.status === 'live' || match.status === 'finished';
  const enVivo = match.status === 'live';

  return (
    <View style={styles.marcador}>
      <View style={styles.equipo}>
        <TeamBadge team={match.homeTeam} size={56} />
        <Text style={styles.equipoNombre} numberOfLines={2}>{match.homeTeam?.name}</Text>
      </View>

      <View style={styles.centro}>
        {enJuegoOTerminado ? (
          <>
            <Text style={styles.cifras}>
              {match.homeScore ?? 0} <Text style={styles.guion}>–</Text> {match.awayScore ?? 0}
            </Text>
            <View style={[styles.estado, enVivo && styles.estadoVivo]}>
              {enVivo && <View style={styles.punto} />}
              <Text style={[styles.estadoTexto, enVivo && styles.estadoTextoVivo]}>
                {enVivo && match.minute != null ? `${match.minute}'` : ESTADOS[match.status]?.texto}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.hora}>{formatKickoff(match.startsAt)}</Text>
            <View style={styles.estado}>
              <Text style={styles.estadoTexto}>{ESTADOS[match.status]?.texto}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.equipo}>
        <TeamBadge team={match.awayTeam} size={56} />
        <Text style={styles.equipoNombre} numberOfLines={2}>{match.awayTeam?.name}</Text>
      </View>
    </View>
  );
}

export default function MatchDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { data, loading, error, reload } = useApiRequest(() => getMatch(id), [id]);
  // Al tocar una cuota se explica que es informativa. VOKTER no acepta apuestas.
  const [cuotaTocada, setCuotaTocada] = useState(null);

  if (loading) {
    return (
      <SportsScreen subtitulo="Partido">
        <LoadingState message="Cargando partido..." />
      </SportsScreen>
    );
  }

  if (error) {
    return (
      <SportsScreen subtitulo="Partido">
        <ErrorState message={error} onRetry={reload} />
        <Pressable onPress={() => navigation.goBack()} style={styles.volver} accessibilityRole="button">
          <ArrowLeft size={16} color={colors.sky} />
          <Text style={styles.volverTexto}>Volver</Text>
        </Pressable>
      </SportsScreen>
    );
  }

  const match = data.match;
  const mercados = match.markets || [];

  return (
    <SportsScreen
      subtitulo="Partido"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.azure} colors={[colors.azure]} />
      }
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.volver} accessibilityRole="button" hitSlop={8}>
        <ArrowLeft size={16} color={colors.sky} />
        <Text style={styles.volverTexto}>Volver</Text>
      </Pressable>

      <View style={styles.cabecera}>
        <Text style={styles.liga}>{match.league?.icon} {match.league?.name}</Text>
        {!!match.stadium && <Text style={styles.estadio}>{match.stadium}</Text>}
      </View>

      <View style={styles.panel}>
        <Marcador match={match} />
      </View>

      <DemoNotice notice={data.notice} />

      {mercados.length === 0 ? (
        <Text style={styles.sinMercados}>Este partido no tiene mercados disponibles.</Text>
      ) : (
        <View style={styles.mercados}>
          <Text style={styles.tituloMercados}>
            {mercados.length} {mercados.length === 1 ? 'mercado disponible' : 'mercados disponibles'}
          </Text>
          {mercados.map((m) => (
            <View key={m.id} style={styles.mercado}>
              <Text style={styles.mercadoNombre}>{m.name}</Text>
              <OddRow odds={m.odds || []} onPressOdd={(o) => setCuotaTocada(o)} />
            </View>
          ))}
        </View>
      )}

      {cuotaTocada && (
        <View style={styles.explicacion} accessibilityRole="alert">
          <Text style={styles.explicacionTexto}>
            «{cuotaTocada.description || cuotaTocada.label}» tiene una cuota demostrativa de{' '}
            {Number(cuotaTocada.value).toFixed(2)}. VØKTER no acepta apuestas ni pagos: esta
            información es solo de consulta.
          </Text>
          <Pressable onPress={() => setCuotaTocada(null)} hitSlop={8} accessibilityRole="button">
            <Text style={styles.explicacionCerrar}>Entendido</Text>
          </Pressable>
        </View>
      )}
    </SportsScreen>
  );
}

const styles = StyleSheet.create({
  volver: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  volverTexto: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.sky },

  cabecera: { gap: 3 },
  liga: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.mist },
  estadio: { fontFamily: fonts.body, fontSize: 12, color: colors.steel },

  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 18,
  },
  marcador: { flexDirection: 'row', alignItems: 'flex-start' },
  equipo: { flex: 1, alignItems: 'center', gap: 9 },
  equipoNombre: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.mist,
    textAlign: 'center',
    lineHeight: 18,
  },
  centro: { width: 104, alignItems: 'center', justifyContent: 'center', gap: 9, paddingTop: 10 },
  cifras: { fontFamily: fonts.displayHeavy, fontSize: 30, color: colors.mist, lineHeight: 34 },
  guion: { color: colors.steel },
  hora: { fontFamily: fonts.monoMedium, fontSize: 13, color: colors.sky, textAlign: 'center' },

  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: alpha.white5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  estadoVivo: { backgroundColor: alpha.live15, borderColor: alpha.live40 },
  punto: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.live },
  estadoTexto: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 0.8, color: colors.steel },
  estadoTextoVivo: { color: colors.live },

  mercados: { gap: 16 },
  tituloMercados: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.steel,
  },
  mercado: { gap: 9 },
  mercadoNombre: { fontFamily: fonts.displaySemi, fontSize: 15, color: colors.mist },
  sinMercados: { fontFamily: fonts.body, fontSize: 13, color: colors.steel, fontStyle: 'italic' },

  explicacion: {
    backgroundColor: alpha.azure10,
    borderWidth: 1,
    borderColor: alpha.azure25,
    borderRadius: radius.md,
    padding: 14,
    gap: 10,
  },
  explicacionTexto: { fontFamily: fonts.body, fontSize: 12, color: colors.sky, lineHeight: 18 },
  explicacionCerrar: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.azure, alignSelf: 'flex-end' },
});
