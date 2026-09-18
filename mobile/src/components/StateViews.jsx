import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Vistas de estado reutilizables: cada pantalla distingue carga, error y vacío
// en lugar de dejar un spinner infinito o una lista vacía engañosa.

export function LoadingState({ message }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.gold} />
      {!!message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function EmptyState({ message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.link}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 12 },
  icon: { fontSize: 28 },
  text: { color: colors.lavender, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  button: { borderWidth: 1, borderColor: colors.gold, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10 },
  buttonText: { color: colors.gold, fontWeight: '600' },
  link: { color: colors.gold, fontSize: 14 },
});
