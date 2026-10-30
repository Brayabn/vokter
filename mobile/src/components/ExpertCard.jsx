import { View, Text, StyleSheet } from 'react-native';
import { colors, hairline, radius } from '../theme';
import Avatar from './Avatar';
import PressableCard from './PressableCard';

// Tarjeta de marca de la tienda. `skills` son sus líneas de producto.
export default function ExpertCard({ expert, onPress }) {
  const lines = (expert.skills || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);

  return (
    <PressableCard style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Avatar name={expert.name} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>{expert.name}</Text>
          <Text style={styles.rating}>★ {expert.rating?.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{expert.bio}</Text>

      <View style={styles.linesRow}>
        {lines.map((s) => (
          <View key={s} style={styles.lineChip}>
            <Text style={styles.lineText}>{s}</Text>
          </View>
        ))}
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  name: { color: colors.mist, fontSize: 15, fontWeight: '700' },
  rating: { color: colors.sky, fontSize: 12, marginTop: 2 },
  bio: { color: colors.steel, fontSize: 13, marginBottom: 10, lineHeight: 19 },
  linesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  lineChip: { backgroundColor: colors.surface2, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  lineText: { color: colors.steel, fontSize: 11 },
});
