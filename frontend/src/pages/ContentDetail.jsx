import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { LoadingState, ErrorState } from '../components/StateViews';

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
    return <div className="max-w-3xl mx-auto px-6 py-12"><LoadingState message="Cargando contenido..." /></div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <ErrorState message={error} onRetry={reload} />
        <Link to="/explorar" className="text-gold hover:text-goldSoft">Volver a explorar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <span className="text-xs font-mono text-lavender">
        {content.category?.icon} {content.category?.name}
      </span>
      <h1 className="font-display font-bold text-3xl text-mist mt-2 mb-4">{content.title}</h1>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <span className="text-sm font-mono text-success">★ {content.rating?.toFixed(1)}</span>
        <span className="text-sm text-lavender">por {content.author?.name}</span>
        {user ? (
          <button
            onClick={toggleFavorite}
            disabled={favSaving || !favReady}
            className={`ml-auto text-sm rounded-full px-4 py-2 border transition-colors disabled:opacity-60 ${
              isFavorite ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-lavender hover:border-white/20'
            }`}
          >
            {!favReady || favSaving ? 'Guardando...' : isFavorite ? '★ En favoritos' : '☆ Agregar a favoritos'}
          </button>
        ) : (
          <Link to="/login" className="ml-auto text-sm rounded-full px-4 py-2 border border-white/10 text-lavender hover:border-white/20">
            ☆ Inicia sesión para guardar
          </Link>
        )}
      </div>
      {favError && <p className="text-sm text-red-400 -mt-4 mb-6">{favError}</p>}

      <p className="text-mist leading-relaxed mb-10">{content.description}</p>

      {content.author && (
        <div className="rounded-2xl bg-surface border border-white/5 p-6">
          <h2 className="font-display font-semibold text-lg text-mist mb-2">Sobre {content.author.name}</h2>
          <p className="text-sm text-lavender mb-4">{content.author.bio}</p>
          <Link
            to={`/experto/${content.author.id}`}
            className="inline-block rounded-full bg-gold text-ink font-semibold px-6 py-3 hover:bg-goldSoft transition-colors"
          >
            Ver perfil del experto
          </Link>
          <p className="text-xs text-lavender mt-3">El contacto directo con expertos estará disponible próximamente.</p>
        </div>
      )}
    </div>
  );
}
