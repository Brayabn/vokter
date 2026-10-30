import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';

// Resultado de VOKTER AI: la marca de la tienda que mejor encaja con la consulta.
export default function MatchCard({ match }) {
  return (
    <GlowCard customSize glowColor="sky" className="flex h-full flex-col gap-3 p-5">
      <div className="relative flex items-center justify-between gap-2">
        <h4 className="font-display font-semibold text-mist">{match.name}</h4>
        <span className="shrink-0 font-mono text-xs px-2 py-1 rounded-full bg-sky/15 text-sky ring-1 ring-sky/30">
          {match.matchScore}% match
        </span>
      </div>
      {/* Barra visual del porcentaje de coincidencia */}
      <div className="relative h-1 w-full rounded-full bg-white/10" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gradient-to-r from-azure to-sky shadow-[0_0_12px_-2px_rgba(111,211,255,0.9)]"
          style={{ width: `${Math.min(match.matchScore, 100)}%` }}
        />
      </div>
      <p className="relative text-sm text-steel line-clamp-2">{match.bio}</p>
      <div className="relative mt-auto flex items-center justify-between pt-2">
        <span className="inline-flex items-center gap-1 text-xs font-mono text-sky">
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          {match.rating?.toFixed(1)}
        </span>
        <Link
          to={`/experto/${match.id}`}
          className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-mist hover:border-sky/50 hover:text-sky transition-colors"
        >
          Ver la marca
        </Link>
      </div>
    </GlowCard>
  );
}
