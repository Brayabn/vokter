import { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { KeyRound } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/errors';
import { validateLogin } from '../utils/validation';
import { goTo } from '../navigation/goTo';
import { Button } from '../components/Buttons';
import FormInput from '../components/FormInput';
import GlowCard from '../components/GlowCard';
import Halo from '../components/Halo';
import { Page } from '../components/Screen';
import { PageHeader } from '../components/Typography';
import { alpha, colors, fonts } from '../theme';

// Pantallas a las que se vuelve tras iniciar sesión (p. ej. "Inicia sesión para guardar"
// desde la ficha de un artículo). Desde cualquier otra se va al panel, como en la web.
const RETURN_TO = ['ContentDetail', 'ExpertProfile'];

/**
 * Acceso (frontend/src/pages/Login.jsx). Se usa de dos formas:
 *  - como pantalla propia ("Ingresar" del menú),
 *  - `embedded` dentro de una página protegida (Panel, Favoritos, Mi cuenta) cuando no hay
 *    sesión: es el <ProtectedRoute> de la web. Al iniciar sesión, la página protegida
 *    aparece sola en su lugar.
 */
export default function LoginScreen({ navigation, embedded = false }) {
  const { login } = useAuth();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      if (embedded) return;
      const { routes, index } = navigation.getState();
      if (RETURN_TO.includes(routes[index - 1]?.name)) navigation.goBack();
      else goTo(navigation, 'Panel');
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos iniciar tu sesión.'));
      setLoading(false);
    }
  }

  return (
    <Page>
      <Halo width={Math.min(width, 480)} stops={[[0, '#1E6BFF', 0.18], [0.65, '#1E6BFF', 0], [1, '#1E6BFF', 0]]} style={{ top: 48, left: (width - Math.min(width, 480)) / 2 - 24 }} />

      <PageHeader
        kicker="Acceso"
        title="Ingresa a"
        accent="VØKTER"
        subtitle="Vuelve a tus favoritos y sigue buscando."
        align="center"
      />

      <GlowCard style={{ padding: 24 }}>
        <View style={{ gap: 16 }}>
          <FormInput
            placeholder="Correo electrónico"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <FormInput
            placeholder="Contraseña"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleSubmit}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button label={loading ? 'Ingresando...' : 'Ingresar'} size="md" onPress={handleSubmit} disabled={loading} block style={{ marginTop: 8 }} />
        </View>

        <Text style={styles.switch}>
          ¿No tienes cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')} accessibilityRole="link">Crear cuenta</Text>
        </Text>
      </GlowCard>

      <View style={styles.demo}>
        <KeyRound size={16} color={colors.sky} style={{ marginTop: 2 }} />
        <View>
          <Text style={styles.demoLabel}>Cuenta demo</Text>
          <Text style={styles.demoText}>demo@vokter.com — vokter123</Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  error: { fontFamily: fonts.body, color: colors.danger, fontSize: 14 },
  switch: { fontFamily: fonts.body, color: colors.steel, fontSize: 14, textAlign: 'center', marginTop: 24 },
  link: { color: colors.sky },
  demo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: alpha.white10,
    backgroundColor: 'rgba(9,15,25,0.6)',
    padding: 16,
  },
  demoLabel: { fontFamily: fonts.mono, color: colors.steel, fontSize: 12, marginBottom: 4 },
  demoText: { fontFamily: fonts.body, color: colors.steel, fontSize: 12 },
});
