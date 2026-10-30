import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import api from '../api/client';
import { getErrorMessage } from '../api/errors';
import MatchCard from './MatchCard';
import { useMotion } from '@/hooks/useMotion';

const EXAMPLES = [
  'busco una chaqueta impermeable para la lluvia',
  'quiero unos audífonos con cancelación de ruido',
  'necesito zapatillas para correr en asfalto',
  'un reloj minimalista de acero para regalar',
];

export default function AiMatchWidget({ variant = 'default' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  // Las tarjetas son visibles por defecto; la entrada escalonada solo ocurre sin reduced-motion.
  useMotion(resultsRef, () => {
    if (!results) return;
    gsap.from(resultsRef.current.querySelectorAll('.result-card'), {
      opacity: 0,
      y: 16,
      scale: 0.96,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.08,
      clearProps: 'transform,opacity',
    });
  }, [results]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (query.trim().length < 3) {
      setError('Cuéntanos un poco más sobre el artículo que buscas.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/ai/match', { query });
      setResults(res.data.results);
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos procesar tu búsqueda. Intenta de nuevo.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={variant === 'hero' ? '' : 'rounded-3xl bg-surface border border-white/10 p-6 sm:p-8'}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué artículo estás buscando?"
          aria-label="Describe el artículo que buscas"
          className="flex-1 rounded-full bg-ink/80 border border-white/15 px-6 py-4 text-mist placeholder:text-steel/70 focus:border-azure/60 focus:ring-4 focus:ring-azure/10 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-azure text-mist font-semibold px-7 py-4 shadow-[0_0_30px_-10px_rgba(30,107,255,0.8)] hover:bg-azureDeep active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? 'Interpretando...' : 'Buscar'}
          {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
        </button>
      </form>

      {!results && (
        <div className="flex flex-wrap gap-2 mt-4">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuery(ex)}
              className="text-xs font-mono text-steel border border-white/15 bg-white/[0.03] rounded-full px-3 py-1.5 hover:border-azure/50 hover:text-mist transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-danger mt-3">{error}</p>}

      {results && (
        <div className="mt-6" ref={resultsRef}>
          <p className="text-xs font-mono text-steel mb-3">
            {results.length > 0
              ? `${results.length} marca${results.length > 1 ? 's' : ''} de la tienda encaja${results.length > 1 ? 'n' : ''} con lo que buscas`
              : 'No encontramos nada con esas palabras. Prueba describiendo el artículo de otra forma.'}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {results.map((m) => (
              <div key={m.id} className="result-card">
                <MatchCard match={m} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
