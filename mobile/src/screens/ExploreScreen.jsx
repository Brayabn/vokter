import { useEffect, useState } from 'react';
import { View } from 'react-native';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import CategoryChips from '../components/CategoryChips';
import ContentCard from '../components/ContentCard';
import FadeInView from '../components/FadeInView';
import { Page } from '../components/Screen';
import SearchInput from '../components/SearchInput';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { PageHeader } from '../components/Typography';

// Catálogo (frontend/src/pages/Explore.jsx).
export default function ExploreScreen({ navigation, route }) {
  const [activeCategory, setActiveCategory] = useState(route.params?.categorySlug || null);
  const [search, setSearch] = useState('');
  // La petición se hace cuando el usuario deja de escribir, no en cada tecla.
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  useEffect(() => {
    if (route.params?.categorySlug) setActiveCategory(route.params.categorySlug);
  }, [route.params?.categorySlug]);

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

  return (
    <Page>
      <PageHeader
        kicker="Catálogo"
        title="Todos los"
        accent="artículos"
        subtitle="Ropa, tecnología, calzado, accesorios, hogar y deporte de las diez marcas de la tienda."
      />

      <SearchInput value={search} onChangeText={setSearch} placeholder="Buscar una chaqueta, audífonos, una silla..." />
      <CategoryChips categories={categories} active={activeCategory} onChange={setActiveCategory} />

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
        <View style={{ gap: 20 }}>
          {contents.map((c, i) => (
            <FadeInView key={c.id} delay={Math.min(i, 6) * 60}>
              <ContentCard content={c} onPress={() => navigation.navigate('ContentDetail', { id: c.id })} />
            </FadeInView>
          ))}
        </View>
      )}
    </Page>
  );
}
