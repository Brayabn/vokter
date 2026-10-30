import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/errors';
import { validateRegister } from '../utils/validation';
import Aurora from '../components/Aurora';
import { colors, hairline, radius } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', bio: '', skills: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSubmit() {
    const validationError = validateRegister(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      navigation.goBack(); // cierra el modal; la sesión ya quedó iniciada
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos crear tu cuenta.'));
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* "handled": con el teclado abierto, el toque en "Crear cuenta" llega al botón
          en vez de solo cerrar el teclado */}
      <Aurora />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>REGISTRO</Text>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Entra como comprador, o como marca que quiere vender en VØKTER.</Text>

        <View style={styles.roleRow}>
          {[{ value: 'user', label: 'Quiero comprar' }, { value: 'expert', label: 'Quiero vender' }].map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.roleOption, form.role === opt.value && styles.roleOptionActive]}
              onPress={() => set('role', opt.value)}
            >
              <Text style={[styles.roleText, form.role === opt.value && styles.roleTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor={colors.steel} value={form.name} onChangeText={(v) => set('name', v)} />
        <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={colors.steel} autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => set('email', v)} />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={colors.steel} secureTextEntry value={form.password} onChangeText={(v) => set('password', v)} />

        {form.role === 'expert' && (
          <>
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Cuéntanos qué vende tu marca" placeholderTextColor={colors.steel} multiline value={form.bio} onChangeText={(v) => set('bio', v)} />
            <TextInput style={styles.input} placeholder="Líneas de producto separadas por coma" placeholderTextColor={colors.steel} value={form.skills} onChangeText={(v) => set('skills', v)} />
          </>
        )}

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Login')} style={{ marginTop: 16 }}>
          <Text style={styles.link}>¿Ya tienes cuenta? Ingresa aquí</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 24, paddingTop: 40 },
  eyebrow: { color: colors.sky, fontSize: 10, letterSpacing: 3, fontWeight: '700', marginBottom: 8 },
  title: { color: colors.mist, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.steel, fontSize: 14, marginBottom: 20, lineHeight: 20 },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  roleOption: { flex: 1, borderWidth: 1, borderColor: hairline, borderRadius: radius.sm, padding: 12, alignItems: 'center' },
  roleOptionActive: { borderColor: colors.sky, backgroundColor: 'rgba(111,211,255,0.14)' },
  roleText: { color: colors.steel, fontSize: 12, textAlign: 'center' },
  roleTextActive: { color: colors.sky },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.sm, paddingHorizontal: 16, paddingVertical: 14,
    color: colors.mist, marginBottom: 12, borderWidth: 1, borderColor: hairline, textAlignVertical: 'top',
  },
  error: { color: colors.danger, marginBottom: 12, fontSize: 13 },
  button: { backgroundColor: colors.azure, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: colors.mist, fontWeight: '700' },
  link: { color: colors.sky, fontSize: 13, textAlign: 'center' },
});
