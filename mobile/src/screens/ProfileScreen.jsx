import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role === 'expert' ? 'Experto' : 'Buscador de conocimiento'}</Text>
        </View>

        {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { alignItems: 'center', padding: 24, paddingTop: 60 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.gold,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: colors.ink },
  name: { color: colors.mist, fontSize: 20, fontWeight: '700' },
  email: { color: colors.lavender, fontSize: 13, marginBottom: 12 },
  roleBadge: { backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 20 },
  roleText: { color: colors.gold, fontSize: 12 },
  bio: { color: colors.lavender, fontSize: 13, textAlign: 'center', marginBottom: 24 },
  logoutButton: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 },
  logoutText: { color: colors.mist, fontSize: 13 },
});
