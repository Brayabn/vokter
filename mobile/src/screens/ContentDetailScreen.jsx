import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { mediaUrl, formatPrice } from '../api/client';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { LoadingState, ErrorState } from '../components/StateViews';
import { colors, hairline, radius } from '../theme';

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
        <LoadingState message="Cargando artículo..." />
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
    : isFavorite ? '★ En favoritos' : '☆ Guardar en favoritos';

  const tags = (content.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{content.category?.icon} {content.category?.name}</Text>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.price}>{formatPrice(content.price)}</Text>
        {!!mediaUrl(content.imageUrl) && (
          <Image source={{ uri: mediaUrl(content.imageUrl) }} style={styles.image} resizeMode="contain" accessibilityLabel={content.title} />
        )}

        <View style={styles.metaRow}>
          <Text style={styles.rating}>★ {content.rating?.toFixed(1)}</Text>
          <Text style={styles.author}>Marca {content.author?.name}</Text>
        </View>

        <TouchableOpacity
          onPress={toggleFavorite}
          disabled={favSaving || (user && !favReady)}
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
        >
          {favSaving || (user && !favReady) ? (
            <ActivityIndicator color={colors.sky} size="small" />
          ) : (
            <Text style={[styles.favText, isFavorite && styles.favTextActive]}>{favLabel}</Text>
          )}
        </TouchableOpacity>
        {!!favError && <Text style={styles.favError}>{favError}</Text>}

        <Text style={styles.description}>{content.description}</Text>

        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((t) => (
              <View key={t} style={styles.tagChip}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        {content.author && (
          <View style={styles.authorCard}>
            <Text style={styles.authorLabel}>LA MARCA</Text>
            <Text style={styles.authorName}>Sobre {content.author.name}</Text>
            <Text style={styles.authorBio}>{content.author.bio}</Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('ExpertProfile', { expert: content.author })}
            >
              <Text style={styles.profileText}>Ver todos sus artículos</Text>
            </TouchableOpacity>
            <Text style={styles.pendingNote}>La compra en línea estará disponible próximamente.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20, paddingBottom: 40 },
  category: { color: colors.sky, fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 10 },
  title: { color: colors.mist, fontSize: 26, fontWeight: '800', marginBottom: 16, lineHeight: 32 },
  price: { color: colors.sky, fontSize: 22, fontWeight: '800', marginBottom: 14 },
  image: { width: '100%', height: 340, borderRadius: radius.lg, backgroundColor: '#ffffff', marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  rating: { color: colors.sky, fontSize: 13 },
  author: { color: colors.steel, fontSize: 13 },
  favButton: {
    alignSelf: 'flex-start', minWidth: 170, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8,
  },
  favButtonActive: { borderColor: colors.sky, backgroundColor: 'rgba(111,211,255,0.14)' },
  favText: { color: colors.steel, fontSize: 13 },
  favTextActive: { color: colors.sky },
  favError: { color: colors.danger, fontSize: 12, marginTop: 8 },
  description: { color: colors.mist, fontSize: 15, lineHeight: 22, marginTop: 20, marginBottom: 24 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24 },
  tagChip: { backgroundColor: colors.surface2, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: colors.steel, fontSize: 11 },
  authorCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: hairline },
  authorLabel: { color: colors.sky, fontSize: 10, letterSpacing: 2, fontWeight: '700', marginBottom: 6 },
  authorName: { color: colors.mist, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  authorBio: { color: colors.steel, fontSize: 13, marginBottom: 14, lineHeight: 19 },
  profileButton: { backgroundColor: colors.azure, borderRadius: radius.pill, paddingVertical: 12, alignItems: 'center' },
  profileText: { color: colors.mist, fontWeight: '700' },
  pendingNote: { color: colors.steel, fontSize: 11, textAlign: 'center', marginTop: 10 },
});
