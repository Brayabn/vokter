import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { Search } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import { Reveal } from '@/components/ui/reveal';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  // La búsqueda se envía cuando el usuario deja de escribir, no en cada tecla.
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  const activeCategory = searchParams.get('categoria') || '';

  const { data: categories } = useApiRequest(
    () => api.get('/categories').then((res) => res.data.categories),
    []
  );

  const { data: contents, loading, error, reload } = useApiRequest(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory) params.categorySlug = activeCategory;
    return api.get('/contents', { params }).then((res) => res.data.contents);
  }, [debouncedSearch, activeCategory]);

  function handleSearch(e) {
    e.preventDefault();
    setSearchParams(activeCategory ? { categoria: activeCategory, search } : { search });
  }

  function toggleCategory(slug) {
    if (slug === activeCategory) {
      setSearchParams(search ? { search } : {});
    } else {
      setSearchParams(search ? { categoria: slug, search } : { categoria: slug });
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Reveal className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Catálogo</p>
        <h1 className="mt-4 font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist">
          Todos los <span className="text-gradient-azure">artículos</span>
        </h1>
        <p className="mt-4 max-w-2xl text-steel text-lg">
          Ropa, tecnología, calzado, accesorios, hogar y deporte de las diez marcas de la tienda.
        </p>
      </Reveal>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-steel/70" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar una chaqueta, audífonos, una silla..."
            className="w-full rounded-full bg-ink/80 border border-white/15 pl-12 pr-5 py-3.5 text-mist placeholder:text-steel/70 focus:border-azure/60 focus:ring-4 focus:ring-azure/10 outline-none transition"
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-10">
        {(categories || []).map((cat) => (
          <button
            key={cat.slug}
            onClick={() => toggleCategory(cat.slug)}
            className={`text-sm rounded-full px-4 py-2 border transition-colors ${
              activeCategory === cat.slug
                ? 'border-azure bg-azure/15 text-sky'
                : 'border-white/10 text-steel hover:border-white/25 hover:text-mist'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : contents.length === 0 ? (
        <EmptyState
          message={debouncedSearch
            ? `No encontramos artículos para "${debouncedSearch}". Prueba con otra búsqueda o categoría.`
            : 'Todavía no hay artículos en esta categoría.'}
        />
      ) : (
        <Reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" deps={[contents]}>
          {contents.map((c) => <ContentCard key={c.id} content={c} />)}
        </Reveal>
      )}
    </div>
  );
}
