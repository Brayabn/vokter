import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import Avatar from './Avatar';

export default function ExpertCard({ expert, onPress }) {
  const skillsList = (expert.skills || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress} disabled={!onPress}>
      <View style={styles.header}>
        <Avatar name={expert.name} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>{expert.name}</Text>
          <Text style={styles.rating}>★ {expert.rating?.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{expert.bio}</Text>

      <View style={styles.skillsRow}>
        {skillsList.map((s) => (
          <View key={s} style={styles.skillChip}>
            <Text style={styles.skillText}>{s}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  name: { color: colors.mist, fontSize: 15, fontWeight: '700' },
  rating: { color: colors.success, fontSize: 12, marginTop: 2 },
  bio: { color: colors.lavender, fontSize: 13, marginBottom: 10, lineHeight: 18 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillChip: { backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  skillText: { color: colors.lavender, fontSize: 11 },
});
