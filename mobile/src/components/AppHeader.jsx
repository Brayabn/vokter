import { useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Menu, X } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { goTo } from '../navigation/goTo';
import { alpha, colors, fonts } from '../theme';
import { Button } from './Buttons';
import { Logo } from './Typography';

export const HEADER_HEIGHT = 64;

/**
 * Barra superior: el Navbar de la web (frontend/src/components/Navbar.jsx) tal y como se ve
 * en un teléfono: logotipo a la izquierda, "Crear cuenta" y el botón de menú a la derecha, y
 * un menú desplegable con las páginas.
 *
 * `overlay` + `scrollY`: en el inicio la barra flota transparente sobre el hero y pasa a
 * fondo oscuro al hacer scroll, igual que en el landing de la web.
 */
export default function AppHeader({ overlay = false, scrollY }) {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Secciones de la app deportiva. Deben coincidir con las pestañas registradas
  // en navigation/RootNavigator.jsx: navegar a un nombre que no exista rompe.
  const links = [
    { name: 'Inicio', label: 'Inicio' },
    { name: 'Partidos', label: 'Partidos' },
    { name: 'Ligas', label: 'Ligas' },
    { name: 'Mercados', label: 'Mercados' },
    ...(user ? [{ name: 'Perfil', label: 'Mi cuenta' }] : []),
  ];

  function go(name) {
    setOpen(false);
    if (name === 'Login' || name === 'Register') navigation.navigate(name);
    else goTo(navigation, name);
  }

  function handleLogout() {
    setOpen(false);
    logout();
    goTo(navigation, 'Inicio');
  }

  const canGoBack = navigation.canGoBack() && route.name !== 'Inicio';

  // Fondo: sobre el hero empieza transparente y se vuelve opaco a los 24 px de scroll.
  const backgroundOpacity = overlay && scrollY
    ? scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' })
    : 1;

  return (
    <View style={[overlay ? styles.overlay : null, { paddingTop: insets.top }]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.background, { opacity: backgroundOpacity }]} />
      <View style={styles.bar}>
        <View style={styles.left}>
          {canGoBack && (
            <Pressable onPress={() => navigation.goBack()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Volver" style={styles.back}>
              <ChevronLeft size={22} color={colors.mist} strokeWidth={2} />
            </Pressable>
          )}
          <Pressable onPress={() => goTo(navigation, 'Inicio')} accessibilityRole="link" accessibilityLabel="VØKTER, ir al inicio">
            <Logo size={20} />
          </Pressable>
        </View>

        <View style={styles.right}>
          {!user && route.name !== 'Register' && (
            <Button label="Crear cuenta" size="sm" onPress={() => go('Register')} style={styles.cta} />
          )}
          <Pressable
            onPress={() => setOpen((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={open ? 'Cerrar menú' : 'Abrir menú'}
            accessibilityState={{ expanded: open }}
            style={({ pressed }) => [styles.menuButton, pressed && { backgroundColor: alpha.white10 }]}
          >
            {open ? <X size={20} color={colors.mist} /> : <Menu size={20} color={colors.mist} />}
          </Pressable>
        </View>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Cerrar menú">
          <View style={[styles.menu, { paddingTop: insets.top }]}>
            <View style={styles.bar}>
              <Logo size={20} />
              <Pressable onPress={() => setOpen(false)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Cerrar menú" style={styles.menuButton}>
                <X size={20} color={colors.mist} />
              </Pressable>
            </View>
            <View style={styles.menuLinks}>
              {links.map((l) => {
                const active = route.name === l.name;
                return (
                  <Pressable key={l.name} onPress={() => go(l.name)} accessibilityRole="link" accessibilityState={{ selected: active }} style={styles.menuItem}>
                    <Text style={[styles.menuText, active && styles.menuTextActive]}>{l.label}</Text>
                  </Pressable>
                );
              })}
              {user ? (
                <Pressable onPress={handleLogout} accessibilityRole="button" style={styles.menuItem}>
                  <Text style={styles.menuText}>Salir</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => go('Login')} accessibilityRole="link" style={styles.menuItem}>
                  <Text style={[styles.menuText, route.name === 'Login' && styles.menuTextActive]}>Ingresar</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 },
  // bg-ink/70 + border-white/10. Sin backdrop-blur en React Native, así que algo más opaco.
  background: { backgroundColor: 'rgba(4,7,13,0.9)', borderBottomWidth: 1, borderBottomColor: alpha.white10 },
  bar: { height: HEADER_HEIGHT, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  back: { marginLeft: -8, padding: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cta: { marginRight: 2 },
  menuButton: { marginRight: -8, padding: 8, borderRadius: 999 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  menu: { backgroundColor: 'rgba(4,7,13,0.97)', borderBottomWidth: 1, borderBottomColor: alpha.white10 },
  menuLinks: { borderTopWidth: 1, borderTopColor: alpha.white10, paddingHorizontal: 24, paddingVertical: 16, gap: 4 },
  menuItem: { paddingVertical: 12 },
  menuText: { fontFamily: fonts.body, fontSize: 16, color: colors.steel },
  menuTextActive: { color: colors.mist },
});
