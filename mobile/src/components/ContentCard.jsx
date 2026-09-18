import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ContentCard({ content, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Text style={styles.category}>{content.category?.icon} {content.category?.name}</Text>
        <Text style={styles.rating}>★ {content.rating?.toFixed(1)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>{content.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{content.description}</Text>
      {/* GET /favorites no incluye el autor: solo se muestra si viene en los datos */}
      {!!content.author?.name && <Text style={styles.author}>Por {content.author.name}</Text>}
    </TouchableOpacity>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { color: colors.lavender, fontSize: 12 },
  rating: { color: colors.success, fontSize: 12, fontVariant: ['tabular-nums'] },
  title: { color: colors.mist, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  description: { color: colors.lavender, fontSize: 13, marginBottom: 8 },
  author: { color: colors.lavender, fontSize: 11 },
});
