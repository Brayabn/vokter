import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api/client';
import { getErrorMessage } from '../api/errors';
import { colors, glow, hairline, radius } from '../theme';
import MatchCard from './MatchCard';

const EXAMPLES = [
  'busco una chaqueta impermeable para la lluvia',
  'quiero unos audífonos con cancelación de ruido',
  'necesito zapatillas para correr en asfalto',
  'un reloj minimalista de acero para regalar',
];

export default function AiMatchWidget() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
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
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <View style={styles.dot} />
        <Text style={styles.label}>VOKTER AI</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="¿Qué artículo estás buscando?"
          placeholderTextColor={colors.steel}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.button} onPress={() => handleSearch()} disabled={loading} activeOpacity={0.85}>
          {loading ? <ActivityIndicator color={colors.mist} /> : <Text style={styles.buttonText}>Buscar</Text>}
        </TouchableOpacity>
      </View>

      {!results && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {EXAMPLES.map((ex) => (
            <TouchableOpacity
              key={ex}
              style={styles.example}
              onPress={() => { setQuery(ex); handleSearch(ex); }}
            >
              <Text style={styles.exampleText}>{ex}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}

      {results && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.resultsLabel}>
            {results.length > 0
              ? `${results.length} marca${results.length > 1 ? 's' : ''} encaja${results.length > 1 ? 'n' : ''} con lo que buscas`
              : 'No encontramos nada con esas palabras. Pruébalo de otra forma.'}
          </Text>
          {results.map((m) => (
            <MatchCard key={m.id} match={m} onPress={() => navigation.navigate('ExpertProfile', { expert: m })} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: hairline,
    ...glow,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.sky },
  label: { color: colors.sky, fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.mist,
    borderWidth: 1,
    borderColor: hairline,
  },
  // Azul con texto blanco: el contraste no da para texto negro sobre `azure`
  button: { backgroundColor: colors.azure, borderRadius: radius.pill, paddingHorizontal: 20, justifyContent: 'center' },
  buttonText: { color: colors.mist, fontWeight: '700' },
  example: {
    borderWidth: 1, borderColor: hairline, borderRadius: radius.pill,
    paddingHorizontal: 12, paddingVertical: 7, marginRight: 8,
  },
  exampleText: { color: colors.steel, fontSize: 11 },
  error: { color: colors.danger, marginTop: 10, fontSize: 13 },
  resultsLabel: { color: colors.steel, fontSize: 12, marginBottom: 10 },
});
