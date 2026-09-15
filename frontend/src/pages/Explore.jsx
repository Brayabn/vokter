import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ContentCard from '../components/ContentCard';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('categoria') || '';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeCategory) params.categorySlug = activeCategory;
    api.get('/contents', { params })
      .then((res) => setContents(res.data.contents))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

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
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-mist mb-8">Explorar</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por tema, habilidad o palabra clave..."
          className="w-full rounded-full bg-surface border border-white/10 px-5 py-3.5 text-mist placeholder:text-lavender/60 focus:border-gold/50 outline-none"
        />
      </form>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => toggleCategory(cat.slug)}
            className={`text-sm rounded-full px-4 py-2 border transition-colors ${
              activeCategory === cat.slug
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/10 text-lavender hover:border-white/20'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-lavender">Cargando...</p>
      ) : contents.length === 0 ? (
        <p className="text-lavender">No encontramos resultados. Prueba con otra búsqueda o categoría.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contents.map((c) => <ContentCard key={c.id} content={c} />)}
        </div>
      )}
    </div>
  );
}
