import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ContentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/contents/${id}`)
      .then((res) => setContent(res.data.content))
      .catch(() => setNotFound(true));
  }, [id]);

  async function toggleFavorite() {
    if (!user) return;
    if (isFavorite) {
      await api.delete(`/favorites/${id}`);
    } else {
      await api.post(`/favorites/${id}`);
    }
    setIsFavorite(!isFavorite);
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-lavender">No encontramos este contenido. Puede que ya no esté disponible.</p>
        <Link to="/explorar" className="text-gold hover:text-goldSoft">Volver a explorar</Link>
      </div>
    );
  }

  if (!content) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-lavender">Cargando...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <span className="text-xs font-mono text-lavender">
        {content.category?.icon} {content.category?.name}
      </span>
      <h1 className="font-display font-bold text-3xl text-mist mt-2 mb-4">{content.title}</h1>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-sm font-mono text-success">★ {content.rating?.toFixed(1)}</span>
        <span className="text-sm text-lavender">por {content.author?.name}</span>
        {user && (
          <button
            onClick={toggleFavorite}
            className={`ml-auto text-sm rounded-full px-4 py-2 border transition-colors ${
              isFavorite ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-lavender hover:border-white/20'
            }`}
          >
            {isFavorite ? '★ En favoritos' : '☆ Agregar a favoritos'}
          </button>
        )}
      </div>

      <p className="text-mist leading-relaxed mb-10">{content.description}</p>

      <div className="rounded-2xl bg-surface border border-white/5 p-6">
        <h2 className="font-display font-semibold text-lg text-mist mb-2">Sobre {content.author?.name}</h2>
        <p className="text-sm text-lavender mb-4">{content.author?.bio}</p>
        <button className="rounded-full bg-gold text-ink font-semibold px-6 py-3 hover:bg-goldSoft transition-colors">
          Contactar
        </button>
      </div>
    </div>
  );
}
