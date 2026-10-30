import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

/**
 * Superficie pulsable con micro-interacción: al tocar, la tarjeta se hunde
 * ligeramente y vuelve con un rebote. Es lo que hace que la app se sienta
 * táctil en lugar de una lista plana, y va en un solo sitio para que todas las
 * tarjetas (artículo, marca, categoría) reaccionen igual.
 *
 * useNativeDriver: la animación corre en el hilo de UI, así que no se entrecorta
 * mientras la lista hace scroll o llega una respuesta de la API.
 */
export default function PressableCard({ children, onPress, style, disabled, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (toValue) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 28,
      bounciness: 8,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      onPressIn={() => animate(0.97)}
      onPressOut={() => animate(1)}
      {...props}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
