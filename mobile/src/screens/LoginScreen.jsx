import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos iniciar tu sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Ingresa a VØKTER</Text>
          <Text style={styles.subtitle}>Continúa descubriendo y conectando.</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={colors.lavender}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colors.lavender}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 16 }}>
            <Text style={styles.link}>¿No tienes cuenta? Crear cuenta</Text>
          </TouchableOpacity>

          <View style={styles.demoBox}>
            <Text style={styles.demoLabel}>Cuenta demo</Text>
            <Text style={styles.demoText}>demo@vokter.com — vokter123</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { color: colors.mist, fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.lavender, fontSize: 14, marginBottom: 24 },
  input: {
    backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: colors.mist, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  error: { color: colors.danger, marginBottom: 12, fontSize: 13 },
  button: { backgroundColor: colors.gold, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: colors.ink, fontWeight: '700' },
  link: { color: colors.gold, fontSize: 13, textAlign: 'center' },
  demoBox: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginTop: 32 },
  demoLabel: { color: colors.lavender, fontSize: 11, marginBottom: 2 },
  demoText: { color: colors.lavender, fontSize: 12 },
});
