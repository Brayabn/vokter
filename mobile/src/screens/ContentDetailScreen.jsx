import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { LoadingState, ErrorState } from '../components/StateViews';
import { colors } from '../theme';

export default function ContentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { user } = useAuth();
  const { data: content, loading, error, reload } = useApiRequest(
    () => api.get(`/contents/${id}`).then((res) => res.data.content),
    [id]
  );

  const [isFavorite, setIsFavorite] = useState(false);
  const [favReady, setFavReady] = useState(false);
  const [favSaving, setFavSaving] = useState(false);
  const [favError, setFavError] = useState('');

  // El backend no tiene "¿es favorito?": se consulta GET /favorites y se busca este id.
  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    let active = true;
    setFavReady(false);
    api.get('/favorites')
      .then((res) => {
        if (active) setIsFavorite(res.data.favorites.some((f) => f.id === Number(id)));
      })
      .catch(() => {
        // Si falla, se asume "no favorito"; agregar/quitar son operaciones idempotentes.
        if (active) setIsFavorite(false);
      })
      .finally(() => {
        if (active) setFavReady(true);
      });
    return () => { active = false; };
  }, [user, id]);

  async function toggleFavorite() {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    setFavSaving(true);
    setFavError('');
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
      } else {
        await api.post(`/favorites/${id}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      setFavError(getErrorMessage(err, 'No pudimos actualizar tus favoritos.'));
    } finally {
      setFavSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <LoadingState message="Cargando contenido..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ErrorState message={error} onRetry={reload} />
      </SafeAreaView>
    );
  }

  const favLabel = !user
    ? '☆ Inicia sesión para guardar'
    : isFavorite ? '★ En favoritos' : '☆ Agregar a favoritos';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{content.category?.icon} {content.category?.name}</Text>
        <Text style={styles.title}>{content.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.rating}>★ {content.rating?.toFixed(1)}</Text>
          <Text style={styles.author}>por {content.author?.name}</Text>
        </View>

        <TouchableOpacity
          onPress={toggleFavorite}
          disabled={favSaving || (user && !favReady)}
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
        >
          {favSaving || (user && !favReady) ? (
            <ActivityIndicator color={colors.gold} size="small" />
          ) : (
            <Text style={[styles.favText, isFavorite && styles.favTextActive]}>{favLabel}</Text>
          )}
        </TouchableOpacity>
        {!!favError && <Text style={styles.favError}>{favError}</Text>}

        <Text style={styles.description}>{content.description}</Text>

        {content.author && (
          <View style={styles.authorCard}>
            <Text style={styles.authorName}>Sobre {content.author.name}</Text>
            <Text style={styles.authorBio}>{content.author.bio}</Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('ExpertProfile', { expert: content.author })}
            >
              <Text style={styles.profileText}>Ver perfil del experto</Text>
            </TouchableOpacity>
            <Text style={styles.pendingNote}>El contacto directo con expertos estará disponible próximamente.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20, paddingBottom: 40 },
  category: { color: colors.lavender, fontSize: 12, marginBottom: 8 },
  title: { color: colors.mist, fontSize: 24, fontWeight: '800', marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  rating: { color: colors.success, fontSize: 13 },
  author: { color: colors.lavender, fontSize: 13 },
  favButton: {
    alignSelf: 'flex-start', minWidth: 170, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8,
  },
  favButtonActive: { borderColor: colors.gold, backgroundColor: 'rgba(232,176,75,0.1)' },
  favText: { color: colors.lavender, fontSize: 13 },
  favTextActive: { color: colors.gold },
  favError: { color: colors.danger, fontSize: 12, marginTop: 8 },
  description: { color: colors.mist, fontSize: 15, lineHeight: 22, marginTop: 20, marginBottom: 24 },
  authorCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  authorName: { color: colors.mist, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  authorBio: { color: colors.lavender, fontSize: 13, marginBottom: 14 },
  profileButton: { backgroundColor: colors.gold, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  profileText: { color: colors.ink, fontWeight: '700' },
  pendingNote: { color: colors.lavender, fontSize: 11, textAlign: 'center', marginTop: 10 },
});
