import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

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

const ICONS = { Inicio: '🏠', Explorar: '🔍', Expertos: '🧑‍💼', Favoritos: '★', Perfil: '👤' };

function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.lavender,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: 'rgba(255,255,255,0.05)' },
        tabBarIcon: () => <Text style={{ fontSize: 16 }}>{ICONS[route.name]}</Text>,
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

  if (loading) return null;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="ContentDetail"
          component={ContentDetailScreen}
          options={{ headerShown: true, headerTitle: '', headerStyle: { backgroundColor: colors.ink }, headerTintColor: colors.mist }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
