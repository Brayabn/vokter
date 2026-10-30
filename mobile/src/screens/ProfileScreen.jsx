import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Aurora from '../components/Aurora';
import { colors, hairline, radius, TAB_BAR_SPACE } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Aurora />
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role === 'expert' ? 'Marca' : 'Comprador'}</Text>
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
  content: { alignItems: 'center', padding: 24, paddingTop: 60, paddingBottom: TAB_BAR_SPACE },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.sky,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    borderWidth: 3, borderColor: 'rgba(30,107,255,0.45)',
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: colors.ink },
  name: { color: colors.mist, fontSize: 20, fontWeight: '700' },
  email: { color: colors.steel, fontSize: 13, marginBottom: 12 },
  roleBadge: {
    backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 20, borderWidth: 1, borderColor: hairline,
  },
  roleText: { color: colors.sky, fontSize: 12 },
  bio: { color: colors.steel, fontSize: 13, textAlign: 'center', marginBottom: 24 },
  logoutButton: { borderWidth: 1, borderColor: hairline, borderRadius: radius.pill, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 },
  logoutText: { color: colors.mist, fontSize: 13 },
});
