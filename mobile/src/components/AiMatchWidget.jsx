import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import api from '../api/client';
import { getErrorMessage } from '../api/errors';
import { alpha, colors, fonts, radius } from '../theme';
import { Button } from './Buttons';
import FadeInView from './FadeInView';
import MatchCard from './MatchCard';

const EXAMPLES = [
  'busco una chaqueta impermeable para la lluvia',
  'quiero unos audífonos con cancelación de ruido',
  'necesito zapatillas para correr en asfalto',
  'un reloj minimalista de acero para regalar',
];

// VOKTER AI (frontend/src/components/AiMatchWidget.jsx). `variant="hero"` va sin tarjeta
// propia porque la pantalla ya lo envuelve en una GlowCard.
export default function AiMatchWidget({ variant = 'default' }) {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(text) {
    const q = text ?? query;
    if (q.trim().length < 3) {
      setError('Cuéntanos un poco más sobre el artículo que buscas.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/ai/match', { query: q });
      setResults(res.data.results);
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos procesar tu búsqueda. Intenta de nuevo.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={variant === 'hero' ? null : styles.box}>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          placeholder="¿Qué artículo estás buscando?"
          placeholderTextColor="rgba(140,163,194,0.7)"
          accessibilityLabel="Describe el artículo que buscas"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        <Button
          label={loading ? 'Interpretando...' : 'Buscar'}
          icon={loading ? undefined : ArrowRight}
          onPress={() => handleSearch()}
          disabled={loading}
          block
        />
      </View>

      {!results && (
        <View style={styles.examples}>
          {EXAMPLES.map((ex) => (
            <Pressable
              key={ex}
              onPress={() => { setQuery(ex); handleSearch(ex); }}
              style={({ pressed }) => [styles.example, pressed && styles.examplePressed]}
            >
              {({ pressed }) => <Text style={[styles.exampleText, pressed && { color: colors.mist }]}>{ex}</Text>}
            </Pressable>
          ))}
        </View>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}

      {results && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.resultsLabel}>
            {results.length > 0
              ? `${results.length} marca${results.length > 1 ? 's' : ''} de la tienda encaja${results.length > 1 ? 'n' : ''} con lo que buscas`
              : 'No encontramos nada con esas palabras. Prueba describiendo el artículo de otra forma.'}
          </Text>
          <View style={{ gap: 16 }}>
            {results.map((m, i) => (
              <FadeInView key={`${m.id}-${query}`} delay={i * 80} distance={16}>
                <MatchCard match={m} onPress={() => navigation.navigate('ExpertProfile', { expert: m })} />
              </FadeInView>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: alpha.white10, padding: 24 },
  form: { gap: 12 },
  input: {
    backgroundColor: alpha.ink80,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: alpha.white15,
    paddingHorizontal: 24,
    paddingVertical: 15,
    color: colors.mist,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  // focus:border-azure/60 focus:ring-4 focus:ring-azure/10
  inputFocused: { borderColor: alpha.azure60, boxShadow: '0px 0px 0px 4px rgba(30,107,255,0.10)' },
  examples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  example: {
    maxWidth: '100%', // en pantallas estrechas el ejemplo largo pasa a dos líneas en vez de salirse
    borderWidth: 1,
    borderColor: alpha.white15,
    backgroundColor: alpha.white3,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  examplePressed: { borderColor: 'rgba(30,107,255,0.5)' },
  exampleText: { fontFamily: fonts.mono, color: colors.steel, fontSize: 12 },
  error: { fontFamily: fonts.body, color: colors.danger, marginTop: 12, fontSize: 14 },
  resultsLabel: { fontFamily: fonts.mono, color: colors.steel, fontSize: 12, marginBottom: 12 },
});
