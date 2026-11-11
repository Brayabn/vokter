import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, Star } from 'lucide-react-native';
import { alpha, colors, fonts, radius } from '../theme';
import Avatar from './Avatar';
import GlowCard from './GlowCard';

// Tarjeta de marca de la tienda. `skills` son sus líneas de producto.
export default function ExpertCard({ expert, onPress, style }) {
  const lines = (expert.skills || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);

  return (
    <GlowCard style={[styles.card, style]} onPress={onPress} accessibilityLabel={`Marca ${expert.name}`}>
      <View style={styles.header}>
        <Avatar name={expert.name} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>{expert.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color={colors.sky} fill={colors.sky} />
            <Text style={styles.rating}>{Number(expert.rating).toFixed(1)}</Text>
          </View>
        </View>
        <ArrowUpRight size={18} color={colors.steel} />
      </View>

      <Text style={styles.bio} numberOfLines={2}>{expert.bio}</Text>

      <View style={styles.linesRow}>
        {lines.map((s) => (
          <View key={s} style={styles.lineChip}>
            <Text style={styles.lineText}>{s}</Text>
          </View>
        ))}
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  name: { fontFamily: fonts.displaySemi, color: colors.mist, fontSize: 17 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontFamily: fonts.mono, color: colors.sky, fontSize: 12 },
  bio: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, marginBottom: 14, lineHeight: 20 },
  linesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  lineChip: {
    backgroundColor: 'rgba(17,28,45,0.8)',
    borderWidth: 1,
    borderColor: alpha.white10,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lineText: { fontFamily: fonts.bodyMedium, color: colors.mist, fontSize: 12 },
});
