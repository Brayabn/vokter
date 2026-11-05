import { Platform, Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme';

/**
 * Texto con degradado: equivalente de .text-gradient-azure / .text-gradient-mist de la web
 * (background-clip: text). El texto se usa como máscara de un LinearGradient; la copia
 * invisible de dentro le da al degradado exactamente el tamaño del texto, también cuando
 * ocupa varias líneas.
 *
 * `variant`: 'azure' (100deg, azul claro → azul) o 'mist' (180deg, blanco → blanco 55%).
 */
export default function GradientText({ children, style, variant = 'azure', colors: customColors, ...props }) {
  const colors = customColors || gradients[variant];

  // react-native-web no enmascara con MaskedView (el texto saldría negro): en `expo start --web`
  // se usa un color plano del degradado. La app Android sí pinta el degradado.
  if (Platform.OS === 'web') {
    return <Text style={[style, { color: variant === 'mist' ? colors[0] : colors[1] }]} {...props}>{children}</Text>;
  }
  // 100deg es casi horizontal; 180deg es vertical (de arriba abajo).
  const direction = variant === 'mist' ? { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } } : { start: { x: 0, y: 0.4 }, end: { x: 1, y: 0.6 } };

  return (
    <MaskedView maskElement={<Text style={style} {...props}>{children}</Text>}>
      <LinearGradient colors={colors} {...direction}>
        {/* Esta copia es la que lee el lector de pantalla: la máscara no es accesible */}
        <Text style={[style, { opacity: 0 }]} {...props}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}
