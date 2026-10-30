import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import ContentCard from '../components/ContentCard';
import { Reveal } from '@/components/ui/reveal';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export default function Favorites() {
  const { data: favorites, loading, error, reload } = useApiRequest(
    () => api.get('/favorites').then((res) => res.data.favorites),
    []
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Reveal className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Tu lista</p>
        <h1 className="mt-4 font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist">
          Tus <span className="text-gradient-azure">favoritos</span>
        </h1>
        <p className="mt-4 max-w-2xl text-steel text-lg">
          Los artículos que guardaste. Los mismos que ves en la app Android con esta cuenta.
        </p>
      </Reveal>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : favorites.length === 0 ? (
        <EmptyState message="Aún no has guardado ningún artículo." actionLabel="Ver el catálogo" actionTo="/explorar" />
      ) : (
        <Reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" deps={[favorites]}>
          {favorites.map((c) => <ContentCard key={c.id} content={c} />)}
        </Reveal>
      )}
    </div>
  );
}
