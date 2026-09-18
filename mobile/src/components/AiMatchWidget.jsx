import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api/client';
import { getErrorMessage } from '../api/errors';
import { colors } from '../theme';
import MatchCard from './MatchCard';

const EXAMPLES = [
  'necesito ayuda con marketing y redes sociales',
  'quiero desarrollar una app web y móvil',
  'busco rediseñar la interfaz de mi producto',
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
      setError('Cuéntanos un poco más sobre lo que necesitas.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/ai/match', { query: q });
      setResults(res.data.results);
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos procesar tu consulta. Intenta de nuevo.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="¿Qué estás buscando?"
          placeholderTextColor={colors.lavender}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.button} onPress={() => handleSearch()} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.ink} /> : <Text style={styles.buttonText}>Buscar</Text>}
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
              ? `Encontramos ${results.length} coincidencia${results.length > 1 ? 's' : ''}`
              : 'No encontramos coincidencias todavía.'}
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
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.mist,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  button: { backgroundColor: colors.gold, borderRadius: 999, paddingHorizontal: 20, justifyContent: 'center' },
  buttonText: { color: colors.ink, fontWeight: '700' },
  example: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 8,
  },
  exampleText: { color: colors.lavender, fontSize: 11 },
  error: { color: colors.danger, marginTop: 10, fontSize: 13 },
  resultsLabel: { color: colors.lavender, fontSize: 12, marginBottom: 10 },
});
