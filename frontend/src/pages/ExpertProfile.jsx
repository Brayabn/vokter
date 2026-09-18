import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import ContentCard from '../components/ContentCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

// Perfil público de un experto: destino de "Ver perfil" (VOKTER AI y detalle de contenido).
export default function ExpertProfile() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApiRequest(
    () => api.get(`/experts/${id}`).then((res) => res.data),
    [id]
  );

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-12"><LoadingState /></div>;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <ErrorState message={error} onRetry={reload} />
        <Link to="/explorar" className="text-gold hover:text-goldSoft">Volver a explorar</Link>
      </div>
    );
  }

  const { expert, contents } = data;
  const skills = (expert.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 text-center sm:text-left">
        <div className="h-24 w-24 shrink-0 rounded-full bg-gold flex items-center justify-center font-display font-extrabold text-4xl text-ink">
          {expert.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-mist">{expert.name}</h1>
          <p className="text-sm font-mono text-success mt-1">★ {Number(expert.rating).toFixed(1)}</p>
          <p className="text-lavender mt-3 max-w-xl">{expert.bio}</p>
          {skills.length > 0 && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              {skills.map((s) => (
                <span key={s} className="text-xs rounded-full bg-surface2 text-lavender px-3 py-1">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gold/25 bg-gold/5 p-5 mb-10">
        <p className="text-gold font-semibold text-sm">Contacto directo — próximamente</p>
        <p className="text-lavender text-sm mt-1">Por ahora puedes explorar sus contenidos y guardarlos en favoritos.</p>
      </div>

      <h2 className="font-display font-semibold text-xl text-mist mb-6">Contenidos publicados</h2>
      {contents.length === 0 ? (
        <EmptyState message="Este experto aún no ha publicado contenidos." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {contents.map((c) => <ContentCard key={c.id} content={{ ...c, author: expert }} />)}
        </div>
      )}
    </div>
  );
}
