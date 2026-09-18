import { useCallback } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import { colors } from '../theme';
import ContentCard from '../components/ContentCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export default function FavoritesScreen({ navigation }) {
  // Se recarga cada vez que la pestaña recibe el foco (pudo cambiar desde el detalle).
  const { data: favorites, loading, error, reload } = useApiRequest(
    () => api.get('/favorites').then((res) => res.data.favorites),
    [],
    { immediate: false }
  );

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Tus favoritos</Text>
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !favorites ? (
        <LoadingState />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={reload}
          ListEmptyComponent={
            <EmptyState
              message="Aún no tienes favoritos guardados."
              actionLabel="Explorar contenidos"
              onAction={() => navigation.navigate('Explorar')}
            />
          }
          renderItem={({ item }) => (
            <ContentCard content={item} onPress={() => navigation.navigate('ContentDetail', { id: item.id })} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  title: { color: colors.mist, fontSize: 24, fontWeight: '800', paddingHorizontal: 20, paddingTop: 16 },
  list: { padding: 20 },
});
