import { Link } from 'react-router-dom';

export default function ContentCard({ content }) {
  return (
    <Link
      to={`/contenido/${content.id}`}
      className="group block rounded-2xl bg-surface border border-white/5 p-5 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-lavender">
          {content.category?.icon} {content.category?.name}
        </span>
        <span className="text-xs font-mono text-success">★ {content.rating?.toFixed(1)}</span>
      </div>
      <h3 className="font-display font-semibold text-lg text-mist group-hover:text-gold transition-colors mb-2">
        {content.title}
      </h3>
      <p className="text-sm text-lavender line-clamp-2 mb-4">{content.description}</p>
      <p className="text-xs text-lavender">Por {content.author?.name}</p>
    </Link>
  );
}
