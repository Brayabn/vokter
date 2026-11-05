import { useCallback } from 'react';
import { RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import { goTo } from '../navigation/goTo';
import ContentCard from '../components/ContentCard';
import FadeInView from '../components/FadeInView';
import { Page } from '../components/Screen';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { PageHeader } from '../components/Typography';
import { colors } from '../theme';

// Favoritos (frontend/src/pages/Favorites.jsx).
export default function FavoritesScreen({ navigation }) {
  // Se recarga cada vez que la pantalla recibe el foco (pudo cambiar desde el detalle).
  const { data: favorites, loading, error, reload } = useApiRequest(
    () => api.get('/favorites').then((res) => res.data.favorites),
    [],
    { immediate: false }
  );

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return (
    <Page
      refreshControl={
        <RefreshControl refreshing={loading && !!favorites} onRefresh={reload} tintColor={colors.sky} colors={[colors.azure]} progressBackgroundColor={colors.surface2} />
      }
    >
      <PageHeader
        kicker="Tu lista"
        title="Tus"
        accent="favoritos"
        subtitle="Los artículos que guardaste. Los mismos que ves en la web con esta cuenta."
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !favorites ? (
        <LoadingState />
      ) : favorites.length === 0 ? (
        <EmptyState message="Aún no has guardado ningún artículo." actionLabel="Ver el catálogo" onAction={() => goTo(navigation, 'Catálogo')} />
      ) : (
        <View style={{ gap: 20 }}>
          {favorites.map((c, i) => (
            <FadeInView key={c.id} delay={Math.min(i, 6) * 60}>
              <ContentCard content={c} onPress={() => navigation.navigate('ContentDetail', { id: c.id })} />
            </FadeInView>
          ))}
        </View>
      )}
    </Page>
  );
}
