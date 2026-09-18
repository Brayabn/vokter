import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function MatchCard({ match, onPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{match.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{match.matchScore}% match</Text>
        </View>
      </View>
      <Text style={styles.bio} numberOfLines={2}>{match.bio}</Text>
      <View style={styles.footer}>
        <Text style={styles.rating}>★ {match.rating?.toFixed(1)}</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { color: colors.mist, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  badge: { backgroundColor: 'rgba(232,176,75,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: colors.gold, fontSize: 11, fontWeight: '600' },
  bio: { color: colors.lavender, fontSize: 13, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rating: { color: colors.success, fontSize: 12 },
  button: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  buttonText: { color: colors.mist, fontSize: 12 },
});
