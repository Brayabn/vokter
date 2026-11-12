import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { CalendarDays, Home, Trophy, User, Target } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { alpha, colors, fonts } from '../theme';

import SportsHomeScreen from '../screens/SportsHomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import LeaguesScreen from '../screens/LeaguesScreen';
import MarketsScreen from '../screens/MarketsScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.ink,
    card: colors.ink,
    text: colors.mist,
    border: colors.border,
    primary: colors.azure,
  },
};

// El <ProtectedRoute> de la web: sin sesión, la página protegida muestra el acceso en su
// lugar y, al iniciar sesión, aparece sola. Las pantallas están siempre registradas para
// que navegar a ellas justo después de iniciar sesión no falle.
function protect(Component) {
  function Protected(props) {
    const { user } = useAuth();
    return user ? <Component {...props} /> : <LoginScreen {...props} embedded />;
  }
  Protected.displayName = `Protected(${Component.name})`;
  return Protected;
}

const ProtectedProfile = protect(ProfileScreen);

const ICONOS = {
  Inicio: Home,
  Partidos: CalendarDays,
  Ligas: Trophy,
  Mercados: Target,
  Perfil: User,
};

/**
 * Barra inferior de pestañas: Inicio, Partidos, Ligas, Mercados y Perfil.
 *
 * Sustituye al menú desplegable del catálogo. En un teléfono una barra fija es
 * más alcanzable con el pulgar y deja ver siempre dónde se está, que es lo que
 * se espera de una app deportiva.
 */
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const Icono = ICONOS[route.name];
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.azure,
          tabBarInactiveTintColor: colors.steel,
          tabBarStyle: {
            backgroundColor: colors.ink,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            // Altura cómoda y margen inferior para los gestos de Android.
            height: 62,
            paddingTop: 6,
            paddingBottom: 8,
          },
          tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
          tabBarIcon: ({ color, focused }) => (
            <Icono size={21} color={color} strokeWidth={focused ? 2.4 : 1.9} />
          ),
        };
      }}
    >
      <Tab.Screen name="Inicio" component={SportsHomeScreen} />
      <Tab.Screen name="Partidos" component={MatchesScreen} />
      <Tab.Screen name="Ligas" component={LeaguesScreen} />
      <Tab.Screen name="Mercados" component={MarketsScreen} />
      <Tab.Screen name="Perfil" component={ProtectedProfile} />
    </Tab.Navigator>
  );
}

/**
 * Las pestañas viven dentro de un stack: así el detalle de un partido y las
 * pantallas de acceso se abren encima, a pantalla completa, sin que la barra
 * inferior estorbe.
 *
 * Las pantallas del catálogo (Explore, Experts, ContentDetail, Favorites,
 * Dashboard, ExpertProfile) ya no se registran aquí: la app pasa a ser la
 * experiencia deportiva y la tienda se queda en la web. Sus archivos se
 * conservan en el repositorio para poder recuperarlas.
 */
export default function RootNavigator() {
  const { loading } = useAuth();

  // Mientras se restaura la sesión se mantiene visible el splash nativo
  // (App.js evita que se oculte solo); se oculta cuando la navegación está lista.
  if (loading) return null;

  return (
    <NavigationContainer theme={navTheme} onReady={() => SplashScreen.hideAsync()}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.ink },
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
