import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

// El splash se oculta manualmente en RootNavigator cuando la sesión ya se restauró.
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Las tipografías de la web (Sora, Inter, IBM Plex Mono) van empaquetadas en la app, así
  // que cargan sin red. Se importa cada archivo por su ruta: el índice de los paquetes
  // arrastraría al APK todos los pesos (~8 MB) aunque solo se usen estos. Si alguna falla,
  // se sigue con la fuente del sistema en vez de quedarse en el splash.
  const [fontsLoaded, fontError] = useFonts({
    Sora_600SemiBold: require('@expo-google-fonts/sora/600SemiBold/Sora_600SemiBold.ttf'),
    Sora_700Bold: require('@expo-google-fonts/sora/700Bold/Sora_700Bold.ttf'),
    Sora_800ExtraBold: require('@expo-google-fonts/sora/800ExtraBold/Sora_800ExtraBold.ttf'),
    Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
    IBMPlexMono_400Regular: require('@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.ttf'),
    IBMPlexMono_500Medium: require('@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'),
    IBMPlexMono_600SemiBold: require('@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.ttf'),
    IBMPlexMono_700Bold: require('@expo-google-fonts/ibm-plex-mono/700Bold/IBMPlexMono_700Bold.ttf'),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
