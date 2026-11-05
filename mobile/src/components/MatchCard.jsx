import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { alpha, colors, fonts, gradients, radius } from '../theme';
import GlowCard from './GlowCard';

// Resultado de VOKTER AI: la marca de la tienda que mejor encaja con la consulta
// (frontend/src/components/MatchCard.jsx).
export default function MatchCard({ match, onPress }) {
  const score = Math.max(0, Math.min(match.matchScore, 100));

  return (
    <GlowCard glowColor="sky" style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>{match.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{match.matchScore}% match</Text>
        </View>
      </View>

      {/* Barra del porcentaje de coincidencia: el dato que diferencia a VOKTER AI */}
      <View style={styles.track} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <LinearGradient colors={gradients.bar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fill, { width: `${score}%` }]} />
      </View>

      <Text style={styles.bio} numberOfLines={2}>{match.bio}</Text>
      <View style={styles.footer}>
        <View style={styles.ratingRow}>
          <Star size={12} color={colors.sky} fill={colors.sky} />
          <Text style={styles.rating}>{match.rating?.toFixed(1)}</Text>
        </View>
        <Pressable
          onPress={onPress}
          accessibilityRole="link"
          accessibilityLabel={`Ver la marca ${match.name}`}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          {({ pressed }) => <Text style={[styles.linkText, pressed && { color: colors.sky }]}>Ver la marca</Text>}
        </Pressable>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  name: { fontFamily: fonts.displaySemi, color: colors.mist, fontSize: 16, flexShrink: 1 },
  badge: {
    backgroundColor: alpha.sky15,
    borderWidth: 1,
    borderColor: alpha.sky30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: { fontFamily: fonts.mono, color: colors.sky, fontSize: 12 },
  track: { height: 4, borderRadius: 2, backgroundColor: alpha.white10, overflow: 'visible' },
  fill: { height: 4, borderRadius: 2, boxShadow: '0px 0px 12px -2px rgba(111,211,255,0.9)' },
  bio: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, lineHeight: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontFamily: fonts.mono, color: colors.sky, fontSize: 12 },
  link: { borderWidth: 1, borderColor: alpha.white15, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  linkPressed: { borderColor: 'rgba(111,211,255,0.5)' },
  linkText: { fontFamily: fonts.body, color: colors.mist, fontSize: 12 },
});
