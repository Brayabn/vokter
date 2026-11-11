import { View, Text, Image, StyleSheet } from 'react-native';
import { ArrowUpRight, Star } from 'lucide-react-native';
import { mediaUrl, formatPrice } from '../api/client';
import { alpha, colors, fonts, radius } from '../theme';
import GlowCard from './GlowCard';

// Tarjeta de artículo del catálogo (frontend/src/components/ContentCard.jsx).
export default function ContentCard({ content, onPress, style }) {
  const image = mediaUrl(content.imageUrl);
  return (
    <GlowCard style={[styles.card, style]} onPress={onPress} accessibilityLabel={`${content.title}, ${formatPrice(content.price)}`}>
      {!!image && (
        <View style={styles.imageBox}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" accessibilityLabel={content.title} />
          {/* Marca discreta: la foto representa el tipo de artículo, no la referencia exacta */}
          {!!content.isStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>ILUSTRATIVA</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.row}>
        <View style={styles.categoryChip}>
          <Text style={styles.category}>{content.category?.icon} {content.category?.name}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Star size={12} color={colors.sky} fill={colors.sky} />
          <Text style={styles.rating}>{content.rating?.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{content.title}</Text>
      {'price' in content && <Text style={styles.price}>{formatPrice(content.price)}</Text>}
      <Text style={styles.description} numberOfLines={2}>{content.description}</Text>
      <View style={styles.footer}>
        {/* GET /favorites no incluye la marca: solo se muestra si viene en los datos */}
        <Text style={styles.brand} numberOfLines={1}>
          {content.author?.name ? <>Marca <Text style={{ color: colors.mist }}>{content.author.name}</Text></> : 'Ver artículo'}
        </Text>
        <ArrowUpRight size={16} color={colors.steel} />
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 24 },
  // -mx-2 -mt-2 mb-4 aspect-[4/3] rounded-xl bg-white
  imageBox: {
    marginHorizontal: -8,
    marginTop: -8,
    marginBottom: 16,
    aspectRatio: 4 / 3,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  stockBadge: {
    position: 'absolute', right: 6, bottom: 6,
    borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2,
    backgroundColor: 'rgba(4,7,13,0.7)',
  },
  stockBadgeText: { color: colors.mist, fontSize: 8, letterSpacing: 0.8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  categoryChip: {
    backgroundColor: alpha.white5,
    borderWidth: 1,
    borderColor: alpha.white10,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  category: { fontFamily: fonts.mono, color: colors.steel, fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontFamily: fonts.mono, color: colors.sky, fontSize: 12 },
  title: { fontFamily: fonts.displaySemi, color: colors.mist, fontSize: 18, lineHeight: 26, marginBottom: 8 },
  price: { fontFamily: fonts.monoSemi, color: colors.sky, fontSize: 16, marginBottom: 8 },
  description: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  brand: { fontFamily: fonts.body, color: colors.steel, fontSize: 12, flexShrink: 1 },
});
