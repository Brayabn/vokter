/**
 * VOKTER AI — motor de matching basado en reglas + similitud de palabras clave.
 *
 * No usa un LLM externo (no es necesario para demostrar el concepto): interpreta
 * la consulta del usuario, la relaciona con categorías conocidas y calcula un
 * porcentaje de afinidad contra los tags/skills de expertos y contenidos.
 *
 * Es intencionalmente simple y transparente para poder explicarlo en la
 * sustentación técnica, pero es fácilmente reemplazable por una llamada a un
 * modelo real (OpenAI/Anthropic) sin cambiar el resto de la arquitectura:
 * basta con sustituir la función `extractKeywords` y `scoreAgainst`.
 */

const STOPWORDS = new Set([
  'de', 'la', 'el', 'en', 'y', 'a', 'un', 'una', 'para', 'con', 'que', 'mi',
  'me', 'necesito', 'busco', 'quiero', 'ayuda', 'ayudarme', 'algo', 'como',
  'los', 'las', 'del', 'al', 'es', 'su', 'sus', 'por', 'sobre',
]);

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9\s]/g, ' ');
}

function extractKeywords(query) {
  return normalize(query)
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

/**
 * Calcula el porcentaje de afinidad entre las keywords de la consulta
 * y el texto combinado (tags/skills/bio) de un candidato.
 */
function scoreAgainst(keywords, candidateText) {
  // Filtramos igual que en extractKeywords para no comparar contra
  // palabras de relleno ("de", "en", "con"...) que generarían falsos positivos.
  const candidateWords = new Set(
    normalize(candidateText).split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
  if (keywords.length === 0) return 0;

  let matches = 0;
  for (const kw of keywords) {
    for (const cw of candidateWords) {
      // Match exacto, o coincidencia de raíz solo entre palabras de al menos
      // 4 letras (evita que "redes" "matchee" con "red" o "de" por azar).
      const sameRoot = kw.length >= 4 && cw.length >= 4 && (cw.startsWith(kw.slice(0, 4)) || kw.startsWith(cw.slice(0, 4)));
      if (cw === kw || sameRoot) {
        matches += 1;
        break;
      }
    }
  }
  return Math.round((matches / keywords.length) * 100);
}

/**
 * Recibe la consulta del usuario y la lista de expertos (Users con role='expert')
 * con sus skills/bio, y devuelve los top N ordenados por afinidad.
 */
function matchExperts(query, experts, topN = 3) {
  const keywords = extractKeywords(query);

  const scored = experts.map((expert) => {
    const candidateText = `${expert.skills || ''} ${expert.bio || ''}`;
    const score = scoreAgainst(keywords, candidateText);
    return { expert, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

module.exports = { extractKeywords, scoreAgainst, matchExperts };
