import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { ShoppingBag, Store } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/errors';
import { validateRegister } from '../utils/validation';
import { goTo } from '../navigation/goTo';
import { Button } from '../components/Buttons';
import FormInput from '../components/FormInput';
import GlowCard from '../components/GlowCard';
import Halo from '../components/Halo';
import { Page } from '../components/Screen';
import { PageHeader } from '../components/Typography';
import { alpha, colors, fonts, radius } from '../theme';

const ROLES = [
  { value: 'user', label: 'Quiero comprar', Icon: ShoppingBag },
  { value: 'expert', label: 'Quiero vender', Icon: Store },
];

// Registro (frontend/src/pages/Register.jsx).
export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { width } = useWindowDimensions();
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
      goTo(navigation, 'Panel'); // la sesión ya quedó iniciada
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos crear tu cuenta.'));
      setLoading(false);
    }
  }

  return (
    <Page>
      <Halo width={Math.min(width, 520)} stops={[[0, '#1E6BFF', 0.18], [0.65, '#1E6BFF', 0], [1, '#1E6BFF', 0]]} style={{ top: 48, left: (width - Math.min(width, 520)) / 2 - 24 }} />

      <PageHeader
        kicker="Registro"
        title="Crea tu"
        accent="cuenta"
        subtitle="Entra como comprador, o como marca que quiere vender en VØKTER."
        align="center"
      />

      <GlowCard style={{ padding: 24 }}>
        <View style={{ gap: 16 }}>
          <View style={styles.roleRow}>
            {ROLES.map(({ value, label, Icon }) => {
              const active = form.role === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => set('role', value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[styles.role, active && styles.roleActive]}
                >
                  <Icon size={16} color={active ? colors.sky : colors.steel} />
                  <Text style={[styles.roleText, active && { color: colors.sky }]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>

          <FormInput placeholder="Nombre completo" autoComplete="name" value={form.name} onChangeText={(v) => set('name', v)} />
          <FormInput placeholder="Correo electrónico" autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={form.email} onChangeText={(v) => set('email', v)} />
          <FormInput placeholder="Contraseña" secureTextEntry autoComplete="new-password" value={form.password} onChangeText={(v) => set('password', v)} />

          {form.role === 'expert' && (
            <>
              <FormInput placeholder="Cuéntanos brevemente qué vende tu marca" multiline value={form.bio} onChangeText={(v) => set('bio', v)} />
              <FormInput placeholder="Líneas de producto separadas por coma (ej: chaquetas, impermeable)" value={form.skills} onChangeText={(v) => set('skills', v)} />
            </>
          )}

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button label={loading ? 'Creando cuenta...' : 'Crear cuenta'} size="md" onPress={handleSubmit} disabled={loading} block style={{ marginTop: 8 }} />
        </View>

        <Text style={styles.switch}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')} accessibilityRole="link">Ingresa aquí</Text>
        </Text>
      </GlowCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  roleRow: { flexDirection: 'row', gap: 12 },
  role: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: alpha.white15,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  roleActive: { borderColor: colors.azure, backgroundColor: alpha.azure10 },
  roleText: { fontFamily: fonts.body, fontSize: 14, color: colors.steel },
  error: { fontFamily: fonts.body, color: colors.danger, fontSize: 14 },
  switch: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, textAlign: 'center', marginTop: 24 },
  link: { color: colors.sky },
});
