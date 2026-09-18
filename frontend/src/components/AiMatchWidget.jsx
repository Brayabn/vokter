import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import api from '../api/client';
import { getErrorMessage } from '../api/errors';
import MatchCard from './MatchCard';

const EXAMPLES = [
  'necesito ayuda con marketing y redes sociales para mi negocio',
  'quiero desarrollar una app web y móvil',
  'busco rediseñar la interfaz de mi producto',
];

export default function AiMatchWidget({ variant = 'default' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!results || !resultsRef.current) return;
    const cards = resultsRef.current.querySelectorAll('.result-card');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Sin animación, pero visibles (las tarjetas arrancan con opacity-0).
      cards.forEach((el) => { el.style.opacity = '1'; });
      return;
    }

    anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [16, 0],
      scale: [0.96, 1],
      delay: anime.stagger(80),
      duration: 500,
      easing: 'easeOutCubic',
    });
  }, [results]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (query.trim().length < 3) {
      setError('Cuéntanos un poco más sobre lo que necesitas.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/ai/match', { query });
      setResults(res.data.results);
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos procesar tu consulta. Intenta de nuevo.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={variant === 'hero' ? '' : 'rounded-3xl bg-surface border border-white/5 p-6 sm:p-8'}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué estás buscando?"
          className="flex-1 rounded-full bg-surface2 border border-white/10 px-5 py-3.5 text-mist placeholder:text-lavender/60 focus:border-gold/50 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gold text-ink font-semibold px-6 py-3.5 hover:bg-goldSoft active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? 'Interpretando...' : 'Buscar'}
        </button>
      </form>

      {!results && (
        <div className="flex flex-wrap gap-2 mt-4">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="text-xs font-mono text-lavender border border-white/10 rounded-full px-3 py-1.5 hover:border-gold/40 hover:text-mist transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

      {results && (
        <div className="mt-6" ref={resultsRef}>
          <p className="text-xs font-mono text-lavender mb-3">
            {results.length > 0
              ? `Encontramos ${results.length} coincidencia${results.length > 1 ? 's' : ''} para ti`
              : 'No encontramos coincidencias todavía. Prueba con otras palabras.'}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {results.map((m) => (
              <div key={m.id} className="result-card opacity-0">
                <MatchCard match={m} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
