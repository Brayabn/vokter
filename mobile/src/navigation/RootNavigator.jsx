import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

import { useAuth } from '../context/AuthContext';
import { colors, hairline } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ExpertsScreen from '../screens/ExpertsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ExpertProfileScreen from '../screens/ExpertProfileScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.ink,
    card: colors.ink,
    text: colors.mist,
    border: hairline,
    primary: colors.sky,
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

const ProtectedDashboard = protect(DashboardScreen);
const ProtectedFavorites = protect(FavoritesScreen);
const ProtectedProfile = protect(ProfileScreen);

// Los nombres de las pantallas son también las claves de navegación: si cambian, hay que
// actualizar los navigate('...') / goTo(navigation, '...') de las pantallas y el menú.
export default function RootNavigator() {
  const { loading } = useAuth();

  // Mientras se restaura la sesión se mantiene visible el splash nativo
  // (App.js evita que se oculte solo); se oculta cuando la navegación está lista.
  if (loading) return null;

  return (
    <NavigationContainer theme={navTheme} onReady={() => SplashScreen.hideAsync()}>
      <Stack.Navigator
        initialRouteName="Inicio"
        // Cada pantalla dibuja su propia barra (components/AppHeader), como el Navbar de la web.
        // fade_from_bottom: la misma entrada suave que PageTransition en la web.
        screenOptions={{ headerShown: false, animation: 'fade_from_bottom', contentStyle: { backgroundColor: colors.ink } }}
      >
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Catálogo" component={ExploreScreen} />
        <Stack.Screen name="Marcas" component={ExpertsScreen} />
        <Stack.Screen name="Panel" component={ProtectedDashboard} />
        <Stack.Screen name="Favoritos" component={ProtectedFavorites} />
        <Stack.Screen name="Perfil" component={ProtectedProfile} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ContentDetail" component={ContentDetailScreen} />
        <Stack.Screen name="ExpertProfile" component={ExpertProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
