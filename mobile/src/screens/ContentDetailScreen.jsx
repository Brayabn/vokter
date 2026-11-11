import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, Heart, ShoppingBag, Star, Store } from 'lucide-react-native';
import api, { mediaUrl, formatPrice } from '../api/client';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { goTo } from '../navigation/goTo';
import Avatar from '../components/Avatar';
import { Button, TextLink } from '../components/Buttons';
import FadeInView from '../components/FadeInView';
import GlowCard from '../components/GlowCard';
import Halo from '../components/Halo';
import { Page } from '../components/Screen';
import { LoadingState, ErrorState } from '../components/StateViews';
import { Kicker } from '../components/Typography';
import { alpha, colors, fonts, glowSky, radius } from '../theme';

// Ficha de un artículo (frontend/src/pages/ContentDetail.jsx): detalle, favorito y la marca.
export default function ContentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { user } = useAuth();
  const { width } = useWindowDimensions();
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
      return undefined;
    }
    let active = true;
    setFavReady(false);
    api.get('/favorites')
      .then((res) => active && setIsFavorite(res.data.favorites.some((f) => f.id === Number(id))))
      // Si falla, se asume "no favorito"; agregar/quitar son operaciones idempotentes.
      .catch(() => active && setIsFavorite(false))
      .finally(() => active && setFavReady(true));
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
    return <Page footer={false}><LoadingState message="Cargando artículo..." /></Page>;
  }

  if (error) {
    return (
      <Page footer={false}>
        <ErrorState message={error} onRetry={reload} />
        <TextLink label="Volver al catálogo" icon={ArrowLeft} onPress={() => goTo(navigation, 'Catálogo')} style={{ alignSelf: 'center' }} />
      </Page>
    );
  }

  const tags = (content.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
  const image = mediaUrl(content.imageUrl);
  const favBusy = user && (favSaving || !favReady);
  const favLabel = !user
    ? 'Inicia sesión para guardar'
    : favBusy ? 'Guardando...' : isFavorite ? 'En favoritos' : 'Guardar en favoritos';

  return (
    <Page>
      {/* Halo ambiental detrás de la cabecera */}
      <Halo width={Math.min(width, 576)} height={288} stops={[[0, '#1E6BFF', 0.14], [1, '#1E6BFF', 0]]} style={{ top: -48, left: (width - Math.min(width, 576)) / 2 - 24 }} />

      <FadeInView style={{ marginBottom: 32 }}>
        <Kicker>{content.category?.icon} {content.category?.name}</Kicker>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.price}>{formatPrice(content.price)}</Text>
        {!!image && (
          <>
            <View style={styles.imageBox}>
              <Image source={{ uri: image }} style={styles.image} resizeMode="contain" accessibilityLabel={content.title} />
            </View>
            {!!content.isStock && (
              <Text style={styles.stockNote}>Imagen ilustrativa: puede variar respecto al producto real.</Text>
            )}
          </>
        )}

        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Star size={16} color={colors.sky} fill={colors.sky} />
            <Text style={styles.rating}>{content.rating?.toFixed(1)}</Text>
          </View>
          <View style={styles.meta}>
            <Store size={16} color={colors.steel} />
            <Text style={styles.brand}>Marca {content.author?.name}</Text>
          </View>
        </View>

        <Pressable
          onPress={toggleFavorite}
          disabled={!!favBusy}
          accessibilityRole="button"
          accessibilityState={{ selected: isFavorite, busy: !!favBusy }}
          style={({ pressed }) => [
            styles.favButton,
            isFavorite && styles.favButtonActive,
            pressed && !isFavorite && { borderColor: 'rgba(111,211,255,0.5)' },
            favBusy && { opacity: 0.6 },
          ]}
        >
          <Heart size={16} color={isFavorite ? colors.sky : colors.mist} fill={isFavorite ? colors.sky : 'none'} />
          <Text style={[styles.favText, isFavorite && { color: colors.sky }]}>{favLabel}</Text>
        </Pressable>
        {!!favError && <Text style={styles.favError}>{favError}</Text>}
      </FadeInView>

      <LinearGradient
        colors={['transparent', 'rgba(111,211,255,0.25)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.divider}
      />

      <FadeInView delay={120}>
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
          <GlowCard style={{ padding: 24 }}>
            <View style={{ gap: 20 }}>
              <Avatar name={content.author.name} size={56} />
              <View>
                <Kicker>La marca</Kicker>
                <Text style={styles.authorName}>Sobre {content.author.name}</Text>
                <Text style={styles.authorBio}>{content.author.bio}</Text>
                <Button
                  label="Ver todos sus artículos"
                  size="md"
                  icon={ArrowRight}
                  onPress={() => navigation.navigate('ExpertProfile', { expert: content.author })}
                />
                <View style={styles.note}>
                  <ShoppingBag size={14} color={colors.steel} />
                  <Text style={styles.noteText}>La compra en línea estará disponible próximamente.</Text>
                </View>
              </View>
            </View>
          </GlowCard>
        )}
      </FadeInView>
    </Page>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.displayHeavy, color: colors.mist, fontSize: 36, lineHeight: 40, letterSpacing: -0.9, marginTop: 12, marginBottom: 24 },
  price: { fontFamily: fonts.monoBold, color: colors.sky, fontSize: 24, marginBottom: 24 },
  imageBox: { marginBottom: 32, borderRadius: radius.md, backgroundColor: '#FFFFFF', overflow: 'hidden', borderWidth: 1, borderColor: alpha.white10 },
  image: { width: '100%', aspectRatio: 1 },
  stockNote: { color: colors.steel, fontSize: 11, textAlign: 'center', marginTop: -8, marginBottom: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 20, rowGap: 12, marginBottom: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rating: { fontFamily: fonts.mono, color: colors.sky, fontSize: 14 },
  brand: { fontFamily: fonts.body, color: colors.steel, fontSize: 14 },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderColor: alpha.white15,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  favButtonActive: { borderColor: colors.sky, backgroundColor: alpha.sky15, ...glowSky },
  favText: { fontFamily: fonts.bodySemi, color: colors.mist, fontSize: 14 },
  favError: { fontFamily: fonts.body, color: colors.danger, fontSize: 14, marginTop: 12 },
  divider: { height: 1, marginBottom: 40 },
  description: { fontFamily: fonts.body, color: 'rgba(242,248,255,0.9)', fontSize: 18, lineHeight: 29, marginBottom: 32 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 48 },
  tagChip: { backgroundColor: 'rgba(17,28,45,0.8)', borderWidth: 1, borderColor: alpha.white10, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { fontFamily: fonts.body, color: colors.steel, fontSize: 12 },
  authorName: { fontFamily: fonts.display, color: colors.mist, fontSize: 20, marginTop: 4, marginBottom: 8 },
  authorBio: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  noteText: { fontFamily: fonts.body, color: colors.steel, fontSize: 12, flexShrink: 1 },
});
