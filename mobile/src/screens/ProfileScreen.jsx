import { View, Text, StyleSheet } from 'react-native';
import { Heart, LayoutDashboard, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { goTo } from '../navigation/goTo';
import Avatar from '../components/Avatar';
import { Button } from '../components/Buttons';
import GlowCard from '../components/GlowCard';
import { Page } from '../components/Screen';
import { PageHeader } from '../components/Typography';
import { alpha, colors, fonts, radius } from '../theme';

// Mi cuenta (solo en la app: en la web el nombre y "Salir" van en la barra superior).
export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    goTo(navigation, 'Inicio');
  }

  return (
    <Page>
      <PageHeader kicker="Tu cuenta" title="Hola," accent={user.name.split(' ')[0]} />

      <GlowCard style={{ padding: 24 }}>
        <View style={styles.identity}>
          <Avatar name={user.name} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={2}>{user.name}</Text>
            <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role === 'expert' ? 'Marca' : 'Comprador'}</Text>
            </View>
          </View>
        </View>
        {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      </GlowCard>

      <View style={styles.actions}>
        <Button label="Ir a mi panel" icon={LayoutDashboard} iconPosition="left" size="md" block onPress={() => goTo(navigation, 'Panel')} />
        <Button label="Mis favoritos" variant="ghost" icon={Heart} iconPosition="left" size="md" block onPress={() => goTo(navigation, 'Favoritos')} />
        <Button label="Salir" variant="ghost" icon={LogOut} iconPosition="left" size="md" block onPress={handleLogout} textColor={colors.steel} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  name: { fontFamily: fonts.display, color: colors.mist, fontSize: 20 },
  email: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, marginTop: 2 },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: alpha.sky30,
    backgroundColor: alpha.sky15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleText: { fontFamily: fonts.mono, color: colors.sky, fontSize: 12 },
  bio: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, lineHeight: 22, marginTop: 20 },
  actions: { gap: 12, marginTop: 32 },
});
