import { View, Text, StyleSheet } from 'react-native';
import { CalendarDays, LogOut, Trophy } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { goTo } from '../navigation/goTo';
import Avatar from '../components/Avatar';
import { Button } from '../components/Buttons';
import SportsScreen, { Seccion } from '../components/SportsScreen';
import { alpha, colors, fonts, radius } from '../theme';

/**
 * Mi cuenta. Es una pestaña, así que usa el marco deportivo (SportsScreen) y no
 * el del catálogo: con `Page` se dibujaría además un pie de página que chocaría
 * con la barra inferior.
 *
 * Los accesos directos apuntan a Partidos y Ligas. Antes iban a "Panel" y
 * "Favoritos", pantallas de la tienda que ya no forman parte de la app.
 */
export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    goTo(navigation, 'Inicio');
  }

  return (
    <SportsScreen subtitulo="Mi cuenta">
      <Seccion etiqueta="Tu cuenta" titulo={`Hola, ${user.name.split(' ')[0]}`} />

      <View style={styles.tarjeta}>
        <View style={styles.identidad}>
          <Avatar name={user.name} size={60} />
          <View style={styles.datos}>
            <Text style={styles.nombre} numberOfLines={2}>{user.name}</Text>
            <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
            <View style={styles.insignia}>
              <Text style={styles.insigniaTexto}>
                {user.role === 'expert' ? 'Marca' : 'Cuenta personal'}
              </Text>
            </View>
          </View>
        </View>
        {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      </View>

      <Text style={styles.nota}>
        Tu cuenta es la misma en la app y en la web de VØKTER. La sesión queda guardada de forma
        cifrada en el teléfono.
      </Text>

      <View style={styles.acciones}>
        <Button
          label="Ver partidos"
          variant="primary"
          icon={CalendarDays}
          iconPosition="left"
          size="md"
          block
          onPress={() => goTo(navigation, 'Partidos')}
        />
        <Button
          label="Explorar ligas"
          variant="ghost"
          icon={Trophy}
          iconPosition="left"
          size="md"
          block
          onPress={() => goTo(navigation, 'Ligas')}
        />
        <Button
          label="Cerrar sesión"
          variant="ghost"
          icon={LogOut}
          iconPosition="left"
          size="md"
          block
          onPress={handleLogout}
          textColor={colors.steel}
        />
      </View>
    </SportsScreen>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 18,
    gap: 16,
  },
  identidad: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  datos: { flex: 1 },
  nombre: { fontFamily: fonts.display, color: colors.mist, fontSize: 18, lineHeight: 24 },
  email: { fontFamily: fonts.body, color: colors.steel, fontSize: 13, marginTop: 2 },
  insignia: {
    alignSelf: 'flex-start',
    marginTop: 9,
    borderRadius: radius.pill,
    backgroundColor: alpha.azure10,
    borderWidth: 1,
    borderColor: alpha.azure25,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  insigniaTexto: { fontFamily: fonts.monoMedium, fontSize: 10, letterSpacing: 1, color: colors.sky },
  bio: { fontFamily: fonts.body, color: colors.steel, fontSize: 13, lineHeight: 20 },

  nota: { fontFamily: fonts.body, fontSize: 12, color: colors.steel, lineHeight: 18 },
  acciones: { gap: 10 },
});
