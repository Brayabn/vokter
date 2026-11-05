import { useState } from 'react';
import { View } from 'react-native';
import api from '../api/client';
import { useApiRequest } from '../hooks/useApiRequest';
import CategoryChips from '../components/CategoryChips';
import ExpertCard from '../components/ExpertCard';
import FadeInView from '../components/FadeInView';
import { Page } from '../components/Screen';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { PageHeader } from '../components/Typography';

// Directorio de marcas (solo en la app; en la web se llega a cada marca desde VOKTER AI o
// desde la ficha de un artículo). Mismo diseño que el catálogo.
export default function ExpertsScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const { data: categories } = useApiRequest(
    () => api.get('/categories').then((res) => res.data.categories),
    []
  );

  const { data: experts, loading, error, reload } = useApiRequest(() => {
    const params = activeCategory ? { categorySlug: activeCategory } : {};
    return api.get('/experts', { params }).then((res) => res.data.experts);
  }, [activeCategory]);

  return (
    <Page>
      <PageHeader
        kicker="Marcas"
        title="Quién vende en"
        accent="VØKTER"
        subtitle="Diez marcas con catálogo propio, filtradas por categoría."
      />

      <CategoryChips categories={categories} active={activeCategory} onChange={setActiveCategory} allLabel="Todas" />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : experts.length === 0 ? (
        <EmptyState message="Ninguna marca tiene artículos en esta categoría todavía." />
      ) : (
        <View style={{ gap: 20 }}>
          {experts.map((e, i) => (
            <FadeInView key={e.id} delay={Math.min(i, 6) * 60}>
              <ExpertCard expert={e} onPress={() => navigation.navigate('ExpertProfile', { expert: e })} />
            </FadeInView>
          ))}
        </View>
      )}
    </Page>
  );
}
