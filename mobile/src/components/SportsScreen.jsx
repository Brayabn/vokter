import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogIn, UserCircle2 } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { alpha, colors, fonts, radius, PAGE_PADDING } from '../theme';

/**
 * Cabecera de las pantallas deportivas: logotipo de VØKTER y, a la derecha, el
 * acceso a la cuenta. Con sesión abierta muestra el nombre; sin ella, el botón
 * de ingresar.
 *
 * Es más sobria que AppHeader (la del catálogo) a propósito: aquí la navegación
 * vive en la barra inferior de pestañas, así que la de arriba no necesita menú.
 */
export function SportsHeader({ subtitulo }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <View style={[styles.cabecera, { paddingTop: insets.top + 10 }]}>
      <View style={styles.marca}>
        <Text style={styles.logo}>
          V<Text style={styles.logoAcento}>Ø</Text>KTER
        </Text>
        {!!subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
      </View>

      {user ? (
        <Pressable
          onPress={() => navigation.navigate('Perfil')}
          accessibilityRole="button"
          accessibilityLabel={`Mi cuenta, ${user.name}`}
          style={({ pressed }) => [styles.cuenta, pressed && styles.cuentaPulsada]}
        >
          <UserCircle2 size={16} color={colors.sky} />
          <Text style={styles.cuentaTexto} numberOfLines={1}>
            {user.name?.split(' ')[0]}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Iniciar sesión"
          style={({ pressed }) => [styles.ingresar, pressed && styles.ingresarPulsado]}
        >
          <LogIn size={15} color={colors.onAzure} />
          <Text style={styles.ingresarTexto}>Ingresar</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * Marco de una pantalla deportiva: fondo azul marino profundo, cabecera fija y
 * contenido con scroll. Sin Footer: la barra de pestañas ocupa el borde
 * inferior y se le reserva espacio con `paddingBottom`.
 */
export default function SportsScreen({ children, subtitulo, refreshControl, scrollRef }) {
  return (
    <View style={styles.raiz}>
      <SportsHeader subtitulo={subtitulo} />
      <ScrollView
        ref={scrollRef}
        refreshControl={refreshControl}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contenido}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/** Encabezado de sección: etiqueta pequeña + título, con acción opcional. */
export function Seccion({ etiqueta, titulo, accion, onAccion, children }) {
  return (
    <View style={styles.seccion}>
      <View style={styles.seccionCabecera}>
        <View style={styles.seccionTextos}>
          {!!etiqueta && <Text style={styles.seccionEtiqueta}>{etiqueta}</Text>}
          <Text style={styles.seccionTitulo}>{titulo}</Text>
        </View>
        {!!accion && (
          <Pressable onPress={onAccion} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.seccionAccion}>{accion}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colors.ink },

  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: PAGE_PADDING,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.ink,
  },
  marca: { flex: 1 },
  logo: { fontFamily: fonts.displayHeavy, fontSize: 20, letterSpacing: -0.4, color: colors.mist },
  logoAcento: { color: colors.azure },
  subtitulo: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.steel,
    marginTop: 2,
  },

  ingresar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    backgroundColor: colors.azure,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
  },
  ingresarPulsado: { backgroundColor: colors.azureDeep },
  // Blanco puro sobre el azul electrico: 4.68:1 (ver theme.js).
  ingresarTexto: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.onAzure },

  cuenta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: 140,
    minHeight: 40,
    backgroundColor: alpha.azure10,
    borderWidth: 1,
    borderColor: alpha.azure25,
    borderRadius: radius.pill,
    paddingHorizontal: 13,
  },
  cuentaPulsada: { backgroundColor: alpha.azure15 },
  cuentaTexto: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.sky },

  // 28 de margen inferior + el alto de la barra de pestañas lo pone el navegador.
  contenido: { paddingHorizontal: PAGE_PADDING, paddingTop: 20, paddingBottom: 28, gap: 28 },

  seccion: { gap: 14 },
  seccionCabecera: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  seccionTextos: { flex: 1, gap: 3 },
  seccionEtiqueta: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.azure,
  },
  seccionTitulo: { fontFamily: fonts.display, fontSize: 19, color: colors.mist },
  seccionAccion: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.sky },
});
