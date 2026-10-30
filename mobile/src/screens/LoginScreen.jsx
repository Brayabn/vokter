import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/errors';
import { validateLogin } from '../utils/validation';
import Aurora from '../components/Aurora';
import { colors, hairline, radius } from '../theme';

// Se usa en dos lugares: como pestaña "Perfil" (sin sesión) y como modal "Login".
export default function LoginScreen({ navigation, route }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isModal = route.name === 'Login';

  async function handleSubmit() {
    const validationError = validateLogin({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      // En la pestaña, al haber usuario se muestra Perfil automáticamente; el modal se cierra.
      if (isModal) navigation.goBack();
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos iniciar tu sesión.'));
      setLoading(false);
    }
  }

  function goToRegister() {
    // Desde el modal se reemplaza (no se apilan modales); desde la pestaña se abre.
    if (isModal) navigation.replace('Register');
    else navigation.navigate('Register');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Aurora />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>ACCESO</Text>
          <Text style={styles.title}>Ingresa a VØKTER</Text>
          <Text style={styles.subtitle}>Vuelve a tus favoritos y sigue buscando.</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={colors.steel}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colors.steel}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToRegister} style={{ marginTop: 16 }}>
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
  eyebrow: { color: colors.sky, fontSize: 10, letterSpacing: 3, fontWeight: '700', marginBottom: 8 },
  title: { color: colors.mist, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.steel, fontSize: 14, marginBottom: 24 },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.sm, paddingHorizontal: 16, paddingVertical: 14,
    color: colors.mist, marginBottom: 12, borderWidth: 1, borderColor: hairline,
  },
  error: { color: colors.danger, marginBottom: 12, fontSize: 13 },
  // Azul con texto blanco (sobre `azure` el texto negro no tendría contraste)
  button: { backgroundColor: colors.azure, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: colors.mist, fontWeight: '700' },
  link: { color: colors.sky, fontSize: 13, textAlign: 'center' },
  demoBox: {
    backgroundColor: colors.surface, borderRadius: radius.sm, padding: 12, marginTop: 32,
    borderWidth: 1, borderColor: hairline,
  },
  demoLabel: { color: colors.steel, fontSize: 11, marginBottom: 2 },
  demoText: { color: colors.steel, fontSize: 12 },
});
