import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import AiMatchWidget from '../components/AiMatchWidget';

const STEPS = [
  { title: 'Descubre', text: 'Cuéntale a VOKTER AI qué necesitas, en tus propias palabras.' },
  { title: 'Conecta', text: 'Recibe expertos y contenidos afines, con un porcentaje de coincidencia real.' },
  { title: 'Colabora', text: 'Contacta directamente y avanza en tu proyecto o aprendizaje.' },
];

// `slug` debe coincidir con categories.slug del backend (ver backend/src/utils/seed.js)
const CATEGORIES = [
  { icon: '📈', name: 'Marketing', slug: 'marketing' },
  { icon: '💻', name: 'Tecnología', slug: 'tecnologia' },
  { icon: '🎨', name: 'Diseño', slug: 'diseno' },
  { icon: '💼', name: 'Negocios', slug: 'negocios' },
  { icon: '🎓', name: 'Educación', slug: 'educacion' },
];

export default function Landing() {
  const heroRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: heroRef.current.querySelectorAll('.animate-in'),
        opacity: [0, 1],
        translateY: [24, 0],
        delay: anime.stagger(90),
        duration: 700,
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="animate-in opacity-0 font-display font-extrabold text-4xl sm:text-5xl leading-[1.1] text-mist mb-6">
            Conecta con lo que sabes.
            <br />
            Encuentra lo que necesitas.
          </h1>
          <p className="animate-in opacity-0 text-lavender text-lg mb-8 max-w-md">
            VØKTER interpreta lo que buscas y te conecta con la persona correcta —
            no con una lista interminable de resultados.
          </p>
          <div className="animate-in opacity-0 flex gap-4">
            <Link to="/explorar" className="rounded-full bg-gold text-ink font-semibold px-6 py-3.5 hover:bg-goldSoft hover:scale-105 active:scale-95 transition-all">
              Explorar
            </Link>
            <Link to="/registro" className="rounded-full border border-white/10 text-mist px-6 py-3.5 hover:bg-surface hover:scale-105 active:scale-95 transition-all">
              Crear cuenta
            </Link>
          </div>
        </div>

        <div className="animate-in opacity-0">
          <AiMatchWidget />
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="font-display font-bold text-2xl text-mist mb-10">¿Cómo funciona?</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display font-semibold text-lg text-mist mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-lavender">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="font-display font-bold text-2xl text-mist mb-10">Explora por categoría</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/explorar?categoria=${cat.slug}`}
              className="flex items-center gap-2 rounded-full bg-surface border border-white/5 px-5 py-3 text-mist hover:border-gold/40 transition-colors"
            >
              <span>{cat.icon}</span>
              <span className="text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Descarga la app */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="rounded-3xl bg-surface border border-white/5 p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-mist mb-2">Lleva VØKTER contigo</h2>
            <p className="text-lavender">Descarga la app móvil y accede a tus favoritos y matches desde cualquier lugar.</p>
          </div>
          <Link to="/descarga" className="rounded-full bg-gold text-ink font-semibold px-6 py-3.5 hover:bg-goldSoft transition-colors whitespace-nowrap">
            Descargar app
          </Link>
        </div>
      </section>
    </div>
  );
}
