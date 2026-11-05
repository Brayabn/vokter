import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { AlertTriangle, ArrowRight, Inbox, Loader2, RotateCw } from 'lucide-react-native';
import { alpha, colors, fonts } from '../theme';
import { Button, TextLink } from './Buttons';

// Vistas de estado reutilizables (frontend/src/components/StateViews.jsx): cada pantalla
// distingue carga, error y vacío en lugar de dejar un spinner infinito o una lista vacía.

function Spinner() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Loader2 size={24} color={colors.sky} />
    </Animated.View>
  );
}

export function LoadingState({ message = 'Cargando...' }) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <View style={[styles.badge, styles.loadingBadge]}>
        <Spinner />
      </View>
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={[styles.badge, styles.errorBadge]}>
        <AlertTriangle size={28} color={colors.danger} />
      </View>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && <Button label="Reintentar" variant="outline" size="md" icon={RotateCw} iconPosition="left" onPress={onRetry} style={{ alignSelf: 'center' }} />}
    </View>
  );
}

export function EmptyState({ message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <View style={[styles.badge, styles.emptyBadge]}>
        <Inbox size={28} color={colors.steel} />
      </View>
      <Text style={styles.emptyText}>{message}</Text>
      {actionLabel && onAction && (
        <TextLink label={actionLabel} onPress={onAction} icon={ArrowRight} size={15} style={{ alignSelf: 'center' }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, paddingHorizontal: 8, gap: 18 },
  badge: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  loadingBadge: {
    width: 48,
    height: 48,
    borderColor: alpha.azure25,
    backgroundColor: alpha.azure10,
    boxShadow: '0px 0px 30px -10px rgba(30,107,255,0.8)',
  },
  errorBadge: { borderColor: alpha.danger30, backgroundColor: alpha.danger10 },
  emptyBadge: { borderColor: alpha.white10, backgroundColor: 'rgba(17,28,45,0.6)' },
  loadingText: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3.6, textTransform: 'uppercase', color: colors.steel, textAlign: 'center' },
  errorText: { fontFamily: fonts.body, color: colors.mist, fontSize: 16, lineHeight: 25, textAlign: 'center', maxWidth: 420 },
  emptyText: { fontFamily: fonts.body, color: colors.steel, fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 420 },
});
