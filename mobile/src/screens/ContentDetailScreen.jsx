import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function ContentDetailScreen({ route }) {
  const { id } = route.params;
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    api.get(`/contents/${id}`).then((res) => setContent(res.data.content)).catch(() => {});
  }, [id]);

  async function toggleFavorite() {
    if (!user) return;
    if (isFavorite) {
      await api.delete(`/favorites/${id}`);
    } else {
      await api.post(`/favorites/${id}`);
    }
    setIsFavorite(!isFavorite);
  }

  if (!content) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{content.category?.icon} {content.category?.name}</Text>
        <Text style={styles.title}>{content.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.rating}>★ {content.rating?.toFixed(1)}</Text>
          <Text style={styles.author}>por {content.author?.name}</Text>
          {user && (
            <TouchableOpacity onPress={toggleFavorite} style={[styles.favButton, isFavorite && styles.favButtonActive]}>
              <Text style={[styles.favText, isFavorite && styles.favTextActive]}>
                {isFavorite ? '★ En favoritos' : '☆ Agregar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.description}>{content.description}</Text>

        <View style={styles.authorCard}>
          <Text style={styles.authorName}>Sobre {content.author?.name}</Text>
          <Text style={styles.authorBio}>{content.author?.bio}</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactText}>Contactar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20 },
  category: { color: colors.lavender, fontSize: 12, marginBottom: 8 },
  title: { color: colors.mist, fontSize: 24, fontWeight: '800', marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  rating: { color: colors.success, fontSize: 13 },
  author: { color: colors.lavender, fontSize: 13 },
  favButton: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 'auto' },
  favButtonActive: { borderColor: colors.gold, backgroundColor: 'rgba(232,176,75,0.1)' },
  favText: { color: colors.lavender, fontSize: 12 },
  favTextActive: { color: colors.gold },
  description: { color: colors.mist, fontSize: 15, lineHeight: 22, marginBottom: 24 },
  authorCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  authorName: { color: colors.mist, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  authorBio: { color: colors.lavender, fontSize: 13, marginBottom: 14 },
  contactButton: { backgroundColor: colors.gold, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  contactText: { color: colors.ink, fontWeight: '700' },
});
