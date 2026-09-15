import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ContentCard from '../components/ContentCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    api.get('/favorites').then((res) => setFavorites(res.data.favorites));
  }, []);

  if (!favorites) {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-lavender">Cargando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-mist mb-8">Tus favoritos</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lavender mb-4">Aún no tienes favoritos guardados.</p>
          <Link to="/explorar" className="text-gold hover:text-goldSoft">Explorar contenidos</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((c) => <ContentCard key={c.id} content={c} />)}
        </div>
      )}
    </div>
  );
}
