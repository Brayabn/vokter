import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, ShoppingBag, Star, Store } from 'lucide-react';
import api, { mediaUrl, formatPrice } from '../api/client';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { LoadingState, ErrorState } from '../components/StateViews';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';

// Ficha de un artículo del catálogo: detalle, favorito y la marca que lo vende.
export default function ContentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: content, loading, error, reload } = useApiRequest(
    () => api.get(`/contents/${id}`).then((res) => res.data.content),
    [id]
  );

  const [isFavorite, setIsFavorite] = useState(false);
  const [favReady, setFavReady] = useState(false);
  const [favSaving, setFavSaving] = useState(false);
  const [favError, setFavError] = useState('');

  // El estado inicial del favorito sale de GET /favorites (el botón ya no arranca siempre en "no").
  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return undefined;
    }
    let active = true;
    setFavReady(false);
    api.get('/favorites')
      .then((res) => active && setIsFavorite(res.data.favorites.some((f) => f.id === Number(id))))
      .catch(() => active && setIsFavorite(false))
      .finally(() => active && setFavReady(true));
    return () => { active = false; };
  }, [user, id]);

  async function toggleFavorite() {
    setFavSaving(true);
    setFavError('');
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
      } else {
        await api.post(`/favorites/${id}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      setFavError(getErrorMessage(err, 'No pudimos actualizar tus favoritos.'));
    } finally {
      setFavSaving(false);
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-12"><LoadingState message="Cargando artículo..." /></div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <ErrorState message={error} onRetry={reload} />
        <Link to="/explorar" className="inline-flex items-center gap-1.5 text-sky hover:text-skySoft transition-colors">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const tags = (content.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div className="relative isolate max-w-3xl mx-auto px-6 py-12 sm:py-16">
      {/* Halo ambiental detrás de la cabecera */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-full max-w-xl -translate-x-1/2 rounded-full bg-azure/12 blur-3xl"
      />

      <Reveal as="header" className="mb-8">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-sky">
          {content.category?.icon} {content.category?.name}
        </span>
        <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist mt-3 mb-6 break-words">
          {content.title}
        </h1>
        <p className="font-mono text-2xl font-bold text-sky mb-6">{formatPrice(content.price)}</p>
        {mediaUrl(content.imageUrl) && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-white ring-1 ring-white/10">
            <img src={mediaUrl(content.imageUrl)} alt={content.title} className="mx-auto max-h-[70vh] w-auto object-contain" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-mono text-sky">
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            {content.rating?.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-steel">
            <Store className="h-4 w-4" aria-hidden="true" />
            Marca {content.author?.name}
          </span>
          {user ? (
            <button
              onClick={toggleFavorite}
              disabled={favSaving || !favReady}
              className={`sm:ml-auto inline-flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 border transition-colors disabled:opacity-60 ${
                isFavorite
                  ? 'border-sky bg-sky/15 text-sky shadow-[0_0_30px_-12px_rgba(111,211,255,0.9)]'
                  : 'border-white/15 text-mist hover:border-sky/50 hover:text-sky'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
              {!favReady || favSaving ? 'Guardando...' : isFavorite ? 'En favoritos' : 'Guardar en favoritos'}
            </button>
          ) : (
            <Link
              to="/login"
              className="sm:ml-auto inline-flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 border border-white/15 text-mist hover:border-sky/50 hover:text-sky transition-colors"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Inicia sesión para guardar
            </Link>
          )}
        </div>
        {favError && <p className="text-sm text-danger mt-3">{favError}</p>}
      </Reveal>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-sky/25 to-transparent mb-10" aria-hidden="true" />

      <Reveal>
        <p className="text-mist/90 text-lg leading-relaxed mb-8 whitespace-pre-line">{content.description}</p>

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-12">
            {tags.map((t) => (
              <li key={t} className="rounded-full bg-surface2/80 ring-1 ring-white/10 px-3 py-1.5 text-xs text-steel">
                {t}
              </li>
            ))}
          </ul>
        )}

        {content.author && (
          <GlowCard customSize className="p-6 sm:p-8">
            <div className="relative flex flex-col sm:flex-row gap-5 sm:items-start">
              <div className="h-14 w-14 shrink-0 rounded-full bg-azure ring-2 ring-sky/40 ring-offset-4 ring-offset-ink flex items-center justify-center font-display font-extrabold text-2xl text-mist shadow-[0_0_30px_-8px_rgba(30,107,255,0.9)]">
                {content.author.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-sky">La marca</span>
                <h2 className="font-display font-bold text-xl text-mist mt-1 mb-2">Sobre {content.author.name}</h2>
                <p className="text-sm text-steel leading-relaxed mb-5">{content.author.bio}</p>
                <Link
                  to={`/experto/${content.author.id}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-azure text-mist font-semibold px-6 py-3 shadow-[0_0_30px_-10px_rgba(30,107,255,0.9)] hover:bg-azureDeep transition-colors"
                >
                  Ver todos sus artículos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <p className="inline-flex items-center gap-1.5 text-xs text-steel mt-3">
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                  La compra en línea estará disponible próximamente.
                </p>
              </div>
            </div>
          </GlowCard>
        )}
      </Reveal>
    </div>
  );
}
