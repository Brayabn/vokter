import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star } from 'lucide-react';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import ContentCard from '../components/ContentCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';

// Página pública de una marca de la tienda: destino de "Ver la marca"
// (resultados de VOKTER AI y ficha de artículo). En el modelo de datos la marca
// es un User con role 'expert', de ahí la ruta /experto/:id y /api/experts/:id.
export default function ExpertProfile() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApiRequest(
    () => api.get(`/experts/${id}`).then((res) => res.data),
    [id]
  );

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-12"><LoadingState message="Cargando la marca..." /></div>;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <ErrorState message={error} onRetry={reload} />
        <Link to="/explorar" className="inline-flex items-center gap-1.5 text-sky hover:text-skySoft transition-colors">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const { expert, contents } = data;
  // skills de la marca = sus líneas de producto (ver backend/src/utils/seedData.js)
  const lines = (expert.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="relative isolate max-w-4xl mx-auto px-6 py-12 sm:py-16">
      {/* Halo ambiental detrás del logotipo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-full max-w-xl -translate-x-1/2 rounded-full bg-azure/12 blur-3xl"
      />

      <Reveal as="header" className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12 text-center sm:text-left">
        <div className="relative shrink-0">
          <div aria-hidden="true" className="absolute -inset-3 rounded-full bg-azure/30 blur-2xl" />
          <div className="relative h-28 w-28 rounded-full bg-azure ring-2 ring-sky/60 ring-offset-4 ring-offset-ink flex items-center justify-center font-display font-extrabold text-5xl text-mist shadow-[0_0_40px_-8px_rgba(30,107,255,0.9)]">
            {expert.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Marca de la tienda</span>
          <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist mt-3 break-words">
            {expert.name}
          </h1>
          <p className="inline-flex items-center gap-1.5 text-sm font-mono text-sky mt-3">
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            {Number(expert.rating).toFixed(1)}
          </p>
          <p className="text-steel text-lg leading-relaxed mt-4 max-w-xl">{expert.bio}</p>
          {lines.length > 0 && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5">
              {lines.map((s) => (
                <span key={s} className="text-xs font-medium rounded-full bg-surface2/80 ring-1 ring-white/10 text-mist px-3 py-1.5">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      <Reveal className="mb-14">
        <GlowCard customSize className="p-6">
          <div className="relative flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky/30 bg-azure/15">
              <ShoppingBag className="h-5 w-5 text-sky" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sky font-semibold text-sm">Compra en línea — próximamente</p>
              <p className="text-steel text-sm mt-1">Por ahora puedes recorrer su catálogo y guardar artículos en tus favoritos.</p>
            </div>
          </div>
        </GlowCard>
      </Reveal>

      <Reveal as="header" className="mb-8">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Catálogo</span>
        <h2 className="font-display font-extrabold tracking-tight text-2xl sm:text-3xl text-mist mt-2">
          Artículos de la <span className="text-gradient-azure">marca</span>
        </h2>
      </Reveal>
      {contents.length === 0 ? (
        <EmptyState message="Esta marca todavía no tiene artículos en el catálogo." />
      ) : (
        <Reveal className="grid sm:grid-cols-2 gap-5" deps={[contents]}>
          {contents.map((c) => <ContentCard key={c.id} content={{ ...c, author: expert }} />)}
        </Reveal>
      )}
    </div>
  );
}
