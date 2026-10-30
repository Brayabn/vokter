import { Link } from 'react-router-dom';
import { ArrowRight, Hand } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useApiRequest } from '../hooks/useApiRequest';
import AiMatchWidget from '../components/AiMatchWidget';
import ContentCard from '../components/ContentCard';
import { LoadingState, ErrorState } from '../components/StateViews';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: contents, loading, error, reload } = useApiRequest(
    () => api.get('/contents', { params: { sort: 'rating' } }).then((res) => res.data.contents.slice(0, 3)),
    []
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Reveal className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Tu panel</p>
        <h1 className="mt-4 font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist">
          {greeting},{' '}
          <span className="text-gradient-azure">{user?.name.split(' ')[0]}</span>
          <Hand className="ml-3 inline-block h-8 w-8 align-baseline text-sky sm:h-10 sm:w-10" aria-hidden="true" />
        </h1>
        <p className="mt-4 text-steel text-lg">¿Qué estás buscando hoy?</p>
      </Reveal>

      {/* Contenedor sin transform propio: el GlowCard necesita background-attachment: fixed */}
      <GlowCard customSize glowColor="deep" className="w-full p-6 sm:p-8">
        <div className="relative">
          <AiMatchWidget variant="hero" />
        </div>
      </GlowCard>

      <div className="flex items-end justify-between gap-4 mt-16 mb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Recomendados</p>
          <h2 className="mt-3 font-display font-bold tracking-tight text-2xl sm:text-3xl text-mist">
            Los artículos mejor valorados
          </h2>
        </div>
        <Link
          to="/explorar"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-sky hover:text-skySoft"
        >
          Ver todo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <Reveal className="grid sm:grid-cols-3 gap-5" deps={[contents]}>
          {contents.map((c) => <ContentCard key={c.id} content={c} />)}
        </Reveal>
      )}
    </div>
  );
}
