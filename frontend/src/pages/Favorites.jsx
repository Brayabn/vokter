import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import ContentCard from '../components/ContentCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export default function Favorites() {
  const { data: favorites, loading, error, reload } = useApiRequest(
    () => api.get('/favorites').then((res) => res.data.favorites),
    []
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-mist mb-8">Tus favoritos</h1>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : favorites.length === 0 ? (
        <EmptyState message="Aún no tienes favoritos guardados." actionLabel="Explorar contenidos" actionTo="/explorar" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((c) => <ContentCard key={c.id} content={c} />)}
        </div>
      )}
    </div>
  );
}
