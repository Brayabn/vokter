import { Link } from 'react-router-dom';
import { ArrowUpRight, Star } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';
import { mediaUrl, formatPrice } from '../api/client';

// Tarjeta de artículo del catálogo.
// Sin hover:translate: un transform en el GlowCard desplazaría su brillo (background-attachment: fixed).
export default function ContentCard({ content }) {
  const image = mediaUrl(content.imageUrl);
  return (
    <GlowCard as={Link} to={`/contenido/${content.id}`} customSize className="group flex h-full flex-col p-6">
      {image && (
        <div className="relative -mx-2 -mt-2 mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-white">
          <img src={image} alt={content.title} loading="lazy" className="h-full w-full object-contain" />
        </div>
      )}
      <div className="relative flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-steel rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-1">
          {content.category?.icon} {content.category?.name}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-mono text-sky">
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          {content.rating?.toFixed(1)}
        </span>
      </div>
      <h3 className="relative font-display font-semibold text-lg text-mist group-hover:text-sky transition-colors mb-2">
        {content.title}
      </h3>
      {'price' in content && (
        <p className="relative font-mono text-base font-semibold text-sky mb-2">{formatPrice(content.price)}</p>
      )}
      <p className="relative text-sm text-steel line-clamp-2 mb-5">{content.description}</p>
      <div className="relative mt-auto flex items-center justify-between gap-3">
        {/* GET /favorites no incluye la marca: solo se muestra si viene en los datos */}
        <p className="min-w-0 truncate text-xs text-steel">
          {content.author?.name ? <>Marca <span className="text-mist">{content.author.name}</span></> : 'Ver artículo'}
        </p>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-steel transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky" aria-hidden="true" />
      </div>
    </GlowCard>
  );
}
