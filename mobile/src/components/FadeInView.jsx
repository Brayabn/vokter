import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Entrada de contenido (fade + slide-up): el <Reveal> de la web (components/ui/reveal.jsx).
 * `delay` permite escalonar varios elementos (efecto stagger).
 */
export default function FadeInView({ children, delay = 0, style, distance = 24 }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      delay,
      easing: Easing.out(Easing.cubic), // power3.out de GSAP
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
