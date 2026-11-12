import { Pressable, View, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { alpha, colors, fonts, radius } from '../theme';
import { ESTADOS, formatKickoff } from '../api/sports';
import TeamBadge from './TeamBadge';
import { OddRow } from './OddButton';

/** Píldora de estado: en vivo (verde y con punto), programado o finalizado. */
function EstadoPill({ status, minute }) {
  const enVivo = status === 'live';
  const texto = enVivo && minute != null ? `${minute}'` : ESTADOS[status]?.corto || status;
  return (
    <View style={[styles.estado, enVivo && styles.estadoVivo]}>
      {enVivo && <View style={styles.punto} />}
      <Text style={[styles.estadoTexto, enVivo && styles.estadoTextoVivo]}>{texto}</Text>
    </View>
  );
}

/** Un equipo con su insignia y su marcador. */
function Lado({ team, score, mostrarMarcador }) {
  return (
    <View style={styles.lado}>
      <TeamBadge team={team} size={36} />
      <Text style={styles.equipo} numberOfLines={2}>
        {team?.shortName || team?.name}
      </Text>
      {mostrarMarcador && <Text style={styles.marcador}>{score ?? 0}</Text>}
    </View>
  );
}

/**
 * Tarjeta de un encuentro: competición, los dos equipos, marcador o la hora, y
 * las cuotas del primer mercado para poder ojearlas sin entrar.
 *
 * Marcadores y cuotas son DEMOSTRATIVOS (ver DemoNotice): la pantalla que
 * incluye esta tarjeta muestra siempre el aviso del API.
 */
export default function SportMatchCard({ match, onPress, onPressOdd, mostrarCuotas = true }) {
  const terminadoOEnJuego = match.status === 'live' || match.status === 'finished';
  const principal = mostrarCuotas ? (match.markets || [])[0] : null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${match.homeTeam?.name} contra ${match.awayTeam?.name}, ${ESTADOS[match.status]?.texto}`}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.pulsada]}
    >
      <View style={styles.cabecera}>
        <Text style={styles.liga} numberOfLines={1}>
          {match.league?.icon} {match.league?.name}
        </Text>
        <EstadoPill status={match.status} minute={match.minute} />
      </View>

      <View style={styles.cuerpo}>
        <Lado team={match.homeTeam} score={match.homeScore} mostrarMarcador={terminadoOEnJuego} />
        <View style={styles.centro}>
          {terminadoOEnJuego ? (
            <Text style={styles.separador}>–</Text>
          ) : (
            <Text style={styles.hora}>{formatKickoff(match.startsAt)}</Text>
          )}
        </View>
        <Lado team={match.awayTeam} score={match.awayScore} mostrarMarcador={terminadoOEnJuego} />
      </View>

      {principal && principal.odds?.length > 0 && (
        <View style={styles.mercado}>
          <Text style={styles.mercadoNombre} numberOfLines={1}>{principal.name}</Text>
          <OddRow odds={principal.odds} onPressOdd={onPressOdd} />
        </View>
      )}

      <View style={styles.pie}>
        <Text style={styles.pieTexto} numberOfLines={1}>
          {match.stadium || 'Estadio por confirmar'}
          {match.markets?.length > 1 ? ` · ${match.markets.length} mercados` : ''}
        </Text>
        <ChevronRight size={16} color={colors.steel} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 12,
  },
  pulsada: { borderColor: alpha.azure25, backgroundColor: '#111A2A' },

  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  liga: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.steel },

  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: alpha.white5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  estadoVivo: { backgroundColor: alpha.live15, borderColor: alpha.live40 },
  punto: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.live },
  estadoTexto: { fontFamily: fonts.monoSemi, fontSize: 10, letterSpacing: 0.8, color: colors.steel },
  estadoTextoVivo: { color: colors.live },

  cuerpo: { flexDirection: 'row', alignItems: 'flex-start' },
  lado: { flex: 1, alignItems: 'center', gap: 6 },
  equipo: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.mist,
    textAlign: 'center',
    lineHeight: 17,
  },
  marcador: { fontFamily: fonts.displayHeavy, fontSize: 24, color: colors.mist, lineHeight: 28 },
  centro: { width: 76, alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
  separador: { fontFamily: fonts.display, fontSize: 18, color: colors.steel },
  hora: { fontFamily: fonts.monoMedium, fontSize: 11, color: colors.sky, textAlign: 'center', lineHeight: 15 },

  mercado: { gap: 7 },
  mercadoNombre: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.steel,
  },

  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: alpha.white5,
    paddingTop: 10,
  },
  pieTexto: { flex: 1, fontFamily: fonts.body, fontSize: 11, color: colors.steel },
});
