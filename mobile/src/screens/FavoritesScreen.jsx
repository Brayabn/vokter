import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { colors } from '../theme';
import ContentCard from '../components/ContentCard';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null);

  const load = useCallback(() => {
    api.get('/favorites').then((res) => setFavorites(res.data.favorites)).catch(() => setFavorites([]));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Tus favoritos</Text>
      {favorites === null ? (
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Aún no tienes favoritos guardados.</Text>}
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
  empty: { color: colors.lavender, textAlign: 'center', marginTop: 40 },
});
