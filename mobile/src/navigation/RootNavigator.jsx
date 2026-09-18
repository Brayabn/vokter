import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

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
    border: 'rgba(255,255,255,0.05)',
    primary: colors.gold,
  },
};

// Cabecera con botón "atrás" para las pantallas de detalle
const detailHeaderOptions = {
  headerShown: true,
  headerTitle: '',
  headerStyle: { backgroundColor: colors.ink },
  headerTintColor: colors.mist,
};

const ICONS ={ Inicio: '🏠', Explorar: '🔍', Expertos: '🧑‍💼', Favoritos: '★', Perfil: '👤' };

function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.lavender,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: 'rgba(255,255,255,0.05)' },
        // `color` hace que "★" (que no es emoji) siga el color activo/inactivo de la barra
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 16, color }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Explorar" component={ExploreScreen} />
      <Tab.Screen name="Expertos" component={ExpertsScreen} />
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
