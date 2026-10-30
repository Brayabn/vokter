import { View, Text, StyleSheet } from 'react-native';
import { colors, hairline, radius } from '../theme';
import PressableCard from './PressableCard';

// Resultado de VOKTER AI: la marca de la tienda que mejor encaja con la consulta.
export default function MatchCard({ match, onPress }) {
  const score = Math.max(0, Math.min(match.matchScore, 100));

  return (
    <PressableCard style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>{match.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{match.matchScore}% match</Text>
        </View>
      </View>

      {/* Barra del porcentaje de coincidencia: el dato que diferencia a VOKTER AI */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${score}%` }]} />
      </View>

      <Text style={styles.bio} numberOfLines={2}>{match.bio}</Text>
      <View style={styles.footer}>
        <Text style={styles.rating}>★ {match.rating?.toFixed(1)}</Text>
        <Text style={styles.link}>Ver la marca →</Text>
      </View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 },
  name: { color: colors.mist, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  badge: { backgroundColor: 'rgba(111,211,255,0.14)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { color: colors.sky, fontSize: 11, fontWeight: '600' },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 10, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: colors.sky },
  bio: { color: colors.steel, fontSize: 13, lineHeight: 19, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rating: { color: colors.sky, fontSize: 12 },
  link: { color: colors.mist, fontSize: 12, fontWeight: '600' },
});
