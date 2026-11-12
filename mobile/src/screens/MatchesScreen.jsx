import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useApiRequest } from '../hooks/useApiRequest';
import { getLeagues, getMatches } from '../api/sports';
import { alpha, colors, fonts, radius } from '../theme';
import SportsScreen, { Seccion } from '../components/SportsScreen';
import DemoNotice from '../components/DemoNotice';
import LeagueChips from '../components/LeagueChips';
import SportMatchCard from '../components/SportMatchCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

const FILTROS = [
  { valor: '', texto: 'Todos' },
  { valor: 'live', texto: 'En vivo' },
  { valor: 'scheduled', texto: 'Programados' },
  { valor: 'finished', texto: 'Finalizados' },
];

/** Filtro por estado del partido. */
function FiltroEstado({ activo, onSelect }) {
  return (
    <View style={styles.filtros}>
      {FILTROS.map((f) => {
        const sel = activo === f.valor;
        return (
          <Pressable
            key={f.valor || 'todos'}
            onPress={() => onSelect(f.valor)}
            accessibilityRole="button"
            accessibilityState={{ selected: sel }}
            style={({ pressed }) => [styles.filtro, sel && styles.filtroActivo, pressed && !sel && styles.filtroPulsado]}
          >
            <Text style={[styles.filtroTexto, sel && styles.filtroTextoActivo]}>{f.texto}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function MatchesScreen({ navigation, route }) {
  // La pantalla de inicio puede llegar aquí con una liga ya elegida.
  const [liga, setLiga] = useState(route.params?.leagueSlug || '');
  const [estado, setEstado] = useState('');

  const ligas = useApiRequest(() => getLeagues(), []);
  const partidos = useApiRequest(
    () => getMatches({ leagueSlug: liga, status: estado }),
    [liga, estado]
  );

  const lista = partidos.data?.matches || [];

  return (
    <SportsScreen
      subtitulo="Partidos"
      refreshControl={
        <RefreshControl refreshing={partidos.loading} onRefresh={partidos.reload} tintColor={colors.azure} colors={[colors.azure]} />
      }
    >
      <Seccion etiqueta="Agenda" titulo="Todos los partidos">
        {!ligas.error && (
          <LeagueChips leagues={ligas.data?.leagues || []} activa={liga} onSelect={setLiga} />
        )}
        <FiltroEstado activo={estado} onSelect={setEstado} />
      </Seccion>

      <DemoNotice notice={partidos.data?.notice} />

      {partidos.loading ? (
        <LoadingState message="Cargando partidos..." />
      ) : partidos.error ? (
        <ErrorState message={partidos.error} onRetry={partidos.reload} />
      ) : lista.length === 0 ? (
        <EmptyState
          message={
            liga || estado
              ? 'Ningún partido coincide con este filtro. Prueba con otra competición o estado.'
              : 'Todavía no hay partidos disponibles.'
          }
          actionLabel={liga || estado ? 'Quitar filtros' : undefined}
          onAction={liga || estado ? () => { setLiga(''); setEstado(''); } : undefined}
        />
      ) : (
        <View style={styles.lista}>
          <Text style={styles.contador}>
            {lista.length} {lista.length === 1 ? 'partido' : 'partidos'}
          </Text>
          {lista.map((m) => (
            <SportMatchCard
              key={m.id}
              match={m}
              onPress={() => navigation.navigate('MatchDetail', { id: m.id })}
            />
          ))}
        </View>
      )}
    </SportsScreen>
  );
}

const styles = StyleSheet.create({
  filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filtro: {
    minHeight: 38,
    justifyContent: 'center',
    backgroundColor: alpha.white5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 15,
  },
  filtroActivo: { backgroundColor: alpha.azure15, borderColor: colors.azure },
  filtroPulsado: { borderColor: alpha.white25 },
  filtroTexto: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.steel },
  filtroTextoActivo: { color: colors.sky },

  lista: { gap: 12 },
  contador: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.steel,
  },
});
