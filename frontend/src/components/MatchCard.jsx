import { Link } from 'react-router-dom';

export default function MatchCard({ match }) {
  return (
    <div className="rounded-2xl bg-surface border border-white/5 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-semibold text-mist">{match.name}</h4>
        <span className="font-mono text-xs px-2 py-1 rounded-full bg-gold/10 text-gold">
          {match.matchScore}% match
        </span>
      </div>
      <p className="text-sm text-lavender line-clamp-2">{match.bio}</p>
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-success">★ {match.rating?.toFixed(1)}</span>
        <Link
          to={`/experto/${match.id}`}
          className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-mist hover:bg-surface2 transition-colors"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
