import { useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { ArrowRight, UserPlus } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { getLeagues, getMatches, getMarkets } from '../api/sports';
import { alpha, colors, fonts, radius } from '../theme';
import SportsScreen, { Seccion } from '../components/SportsScreen';
import DemoNotice from '../components/DemoNotice';
import LeagueChips from '../components/LeagueChips';
import SportMatchCard from '../components/SportMatchCard';
import MarketCard from '../components/MarketCard';
import { Button } from '../components/Buttons';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

/** Tarjeta de bienvenida: invita a crear cuenta o saluda a quien ya entró. */
function Bienvenida({ user, navigation }) {
  if (user) {
    return (
      <View style={styles.bienvenida}>
        <Text style={styles.saludo}>Hola, {user.name?.split(' ')[0]}</Text>
        <Text style={styles.bienvenidaTexto}>
          Tu sesión está activa. Consulta las competiciones, los partidos y los mercados disponibles.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.bienvenida}>
      <Text style={styles.saludo}>Bienvenido a VØKTER Deportes</Text>
      <Text style={styles.bienvenidaTexto}>
        Consulta competiciones, partidos y mercados. Crea tu cuenta para guardar tus preferencias;
        la misma te sirve en la web.
      </Text>
      <View style={styles.botones}>
        <Button
          label="Crear cuenta"
          variant="primary"
          size="md"
          icon={UserPlus}
          iconPosition="left"
          onPress={() => navigation.navigate('Register')}
        />
        <Button
          label="Iniciar sesión"
          variant="ghost"
          size="md"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}

export default function SportsHomeScreen({ navigation }) {
  const { user } = useAuth();

  const ligas = useApiRequest(() => getLeagues(), []);
  const partidos = useApiRequest(() => getMatches({ popular: true }), []);
  const mercados = useApiRequest(() => getMarkets(), []);

  const cargando = ligas.loading || partidos.loading || mercados.loading;
  // Un fallo en cualquiera de las tres llamadas no tumba la pantalla: cada
  // sección muestra su propio estado y el resto sigue siendo utilizable.
  const recargar = useCallback(() => {
    ligas.reload();
    partidos.reload();
    mercados.reload();
  }, [ligas.reload, partidos.reload, mercados.reload]);

  const aviso = partidos.data?.notice || ligas.data?.notice || mercados.data?.notice;

  return (
    <SportsScreen
      subtitulo="Deportes"
      refreshControl={
        <RefreshControl refreshing={cargando} onRefresh={recargar} tintColor={colors.azure} colors={[colors.azure]} />
      }
    >
      <Bienvenida user={user} navigation={navigation} />

      <DemoNotice notice={aviso} />

      <Seccion
        etiqueta="Competiciones"
        titulo="Ligas destacadas"
        accion="Ver todas"
        onAccion={() => navigation.navigate('Ligas')}
      >
        {ligas.loading ? (
          <LoadingState message="Cargando competiciones..." />
        ) : ligas.error ? (
          <ErrorState message={ligas.error} onRetry={ligas.reload} />
        ) : ligas.data?.leagues?.length ? (
          <LeagueChips
            leagues={ligas.data.leagues}
            activa=""
            onSelect={(slug) => navigation.navigate('Partidos', slug ? { leagueSlug: slug } : undefined)}
          />
        ) : (
          <EmptyState message="Todavía no hay competiciones disponibles." />
        )}
      </Seccion>

      <Seccion
        etiqueta="En cartelera"
        titulo="Partidos populares"
        accion="Ver todos"
        onAccion={() => navigation.navigate('Partidos')}
      >
        {partidos.loading ? (
          <LoadingState message="Cargando partidos..." />
        ) : partidos.error ? (
          <ErrorState message={partidos.error} onRetry={partidos.reload} />
        ) : partidos.data?.matches?.length ? (
          <View style={styles.lista}>
            {partidos.data.matches.slice(0, 4).map((m) => (
              <SportMatchCard
                key={m.id}
                match={m}
                onPress={() => navigation.navigate('MatchDetail', { id: m.id })}
              />
            ))}
          </View>
        ) : (
          <EmptyState message="No hay partidos destacados ahora mismo." />
        )}
      </Seccion>

      <Seccion
        etiqueta="Tipos de apuesta"
        titulo="Mercados populares"
        accion="Ver todos"
        onAccion={() => navigation.navigate('Mercados')}
      >
        {mercados.loading ? (
          <LoadingState message="Cargando mercados..." />
        ) : mercados.error ? (
          <ErrorState message={mercados.error} onRetry={mercados.reload} />
        ) : mercados.data?.markets?.length ? (
          <View style={styles.lista}>
            {mercados.data.markets.slice(0, 3).map((mk) => (
              <MarketCard
                key={mk.type}
                market={mk}
                onPress={() => navigation.navigate('MatchDetail', { id: mk.ejemplo.matchId })}
              />
            ))}
          </View>
        ) : (
          <EmptyState message="No hay mercados disponibles." />
        )}
      </Seccion>

      <View style={styles.pie}>
        <Text style={styles.pieTexto}>
          VØKTER no acepta apuestas, depósitos ni retiros. Esta sección es informativa.
        </Text>
        <Button
          label="Ver todos los partidos"
          variant="ghost"
          size="md"
          icon={ArrowRight}
          onPress={() => navigation.navigate('Partidos')}
        />
      </View>
    </SportsScreen>
  );
}

const styles = StyleSheet.create({
  bienvenida: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 18,
    gap: 10,
  },
  saludo: { fontFamily: fonts.displayHeavy, fontSize: 21, color: colors.mist, lineHeight: 27 },
  bienvenidaTexto: { fontFamily: fonts.body, fontSize: 13, color: colors.steel, lineHeight: 20 },
  botones: { flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' },

  lista: { gap: 12 },

  pie: { gap: 14, alignItems: 'center', paddingTop: 4 },
  pieTexto: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.steel,
    textAlign: 'center',
    lineHeight: 17,
  },
});
