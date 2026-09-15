import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import AiMatchWidget from '../components/AiMatchWidget';
import ContentCard from '../components/ContentCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);

  useEffect(() => {
    api.get('/contents?sort=rating').then((res) => setContents(res.data.contents.slice(0, 3)));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-mist mb-1">
        {greeting}, {user?.name.split(' ')[0]} 👋
      </h1>
      <p className="text-lavender mb-10">¿Qué quieres descubrir hoy?</p>

      <AiMatchWidget />

      <div className="flex items-center justify-between mt-14 mb-6">
        <h2 className="font-display font-semibold text-xl text-mist">Mejor valorados para ti</h2>
        <Link to="/explorar" className="text-sm text-gold hover:text-goldSoft">Ver todo</Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {contents.map((c) => <ContentCard key={c.id} content={c} />)}
      </div>
    </div>
  );
}
