import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { useAuth } from '../context/AuthContext';
import { colors, hairline, radius } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ExpertsScreen from '../screens/ExpertsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ExpertProfileScreen from '../screens/ExpertProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.ink,
    card: colors.surface,
    text: colors.mist,
    border: hairline,
    primary: colors.sky,
  },
};

// Cabecera de las pantallas de detalle: sin título y con el mismo negro del
// fondo, para que la pantalla se sienta continua y el contenido mande.
const detailHeaderOptions = {
  headerShown: true,
  headerTitle: '',
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.ink },
  headerTintColor: colors.sky,
};

// Los nombres de las pestañas son también las claves de navegación: si cambian,
// hay que actualizar los navigation.navigate('...') de las pantallas.
const ICONS = { Inicio: '🏠', Catálogo: '🔎', Marcas: '🏷️', Favoritos: '★', Perfil: '👤' };

function TabIcon({ name, color, focused }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={{ fontSize: 15, color }}>{ICONS[name]}</Text>
    </View>
  );
}

function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.sky,
        tabBarInactiveTintColor: colors.steel,
        // Barra flotante: se despega de los bordes y deja ver el fondo detrás.
        // Las listas reservan TAB_BAR_SPACE abajo para no quedar tapadas.
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: { paddingTop: 8 },
        tabBarLabelStyle: styles.tabLabel,
        // `color` hace que "★" (que no es emoji) siga el color activo/inactivo
        tabBarIcon: ({ color, focused }) => <TabIcon name={route.name} color={color} focused={focused} />,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Catálogo" component={ExploreScreen} />
      <Tab.Screen name="Marcas" component={ExpertsScreen} />
      {user && <Tab.Screen name="Favoritos" component={FavoritesScreen} />}
      <Tab.Screen name="Perfil" component={user ? ProfileScreen : LoginScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { loading } = useAuth();

  // Mientras se restaura la sesión se mantiene visible el splash nativo
  // (App.js evita que se oculte solo); se oculta cuando la navegación está lista.
  if (loading) return null;

  return (
    <NavigationContainer theme={navTheme} onReady={() => SplashScreen.hideAsync()}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="ContentDetail" component={ContentDetailScreen} options={detailHeaderOptions} />
        <Stack.Screen name="ExpertProfile" component={ExpertProfileScreen} options={detailHeaderOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 68,
    paddingBottom: 10,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(9,15,25,0.96)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: hairline,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
  tabLabel: { fontSize: 10, fontWeight: '600' },
  tabIcon: {
    width: 34,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // La pestaña activa se marca con un halo azul además del color del icono
  tabIconActive: { backgroundColor: 'rgba(30,107,255,0.22)' },
});
