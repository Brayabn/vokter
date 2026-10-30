import { View, Text, Image, StyleSheet } from 'react-native';
import { mediaUrl, formatPrice } from '../api/client';
import { colors, hairline, radius, veil } from '../theme';
import PressableCard from './PressableCard';

// Tarjeta de artículo del catálogo.
export default function ContentCard({ content, onPress }) {
  const image = mediaUrl(content.imageUrl);
  return (
    <PressableCard style={styles.card} onPress={onPress}>
      {!!image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" accessibilityLabel={content.title} />}
      <View style={styles.row}>
        <View style={styles.categoryChip}>
          <Text style={styles.category}>{content.category?.icon} {content.category?.name}</Text>
        </View>
        <Text style={styles.rating}>★ {content.rating?.toFixed(1)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{content.title}</Text>
      {'price' in content && <Text style={styles.price}>{formatPrice(content.price)}</Text>}
      <Text style={styles.description} numberOfLines={2}>{content.description}</Text>
      {/* GET /favorites no incluye la marca: solo se muestra si viene en los datos */}
      {!!content.author?.name && (
        <View style={styles.footer}>
          <Text style={styles.brand}>Marca {content.author.name}</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      )}
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: hairline,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryChip: { backgroundColor: veil, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  category: { color: colors.steel, fontSize: 11 },
  rating: { color: colors.sky, fontSize: 12, fontVariant: ['tabular-nums'] },
  image: { width: '100%', height: 180, borderRadius: radius.md, backgroundColor: '#ffffff', marginBottom: 12 },
  price: { color: colors.sky, fontSize: 15, fontWeight: '700', marginBottom: 6, fontVariant: ['tabular-nums'] },
  title: { color: colors.mist, fontSize: 16, fontWeight: '700', marginBottom: 6, lineHeight: 21 },
  description: { color: colors.steel, fontSize: 13, lineHeight: 19 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  brand: { color: colors.steel, fontSize: 11, flexShrink: 1 },
  arrow: { color: colors.sky, fontSize: 14 },
});
