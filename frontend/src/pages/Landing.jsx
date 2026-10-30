import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Dumbbell,
  Heart,
  Laptop,
  LayoutDashboard,
  MessageSquareText,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  Footprints,
  UserPlus,
  Watch,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMotion } from '@/hooks/useMotion';
import AiMatchWidget from '../components/AiMatchWidget';
import { GlowCard } from '@/components/ui/spotlight-card';
import { CinematicFooter } from '@/components/ui/motion-footer';
import Showcase3D from '@/components/ui/showcase-3d';

const STEPS = [
  {
    icon: MessageSquareText,
    title: 'Descríbelo',
    text: 'Dile a VOKTER AI qué necesitas como se lo dirías a un amigo: "una chaqueta para la lluvia".',
  },
  {
    icon: Sparkles,
    title: 'Compara',
    text: 'Te mostramos las marcas de la tienda que lo venden, con un porcentaje de coincidencia real.',
  },
  {
    icon: Heart,
    title: 'Guárdalo',
    text: 'Añade los artículos a tus favoritos y encuéntralos igual en la web y en la app Android.',
  },
];

// `slug` debe coincidir con categories.slug del backend (ver backend/src/utils/seedData.js)
const CATEGORIES = [
  { icon: Shirt, name: 'Ropa', slug: 'ropa', text: 'Chaquetas, abrigos, lino y denim.', span: 'lg:col-span-4' },
  { icon: Laptop, name: 'Tecnología', slug: 'tecnologia', text: 'Audio, periféricos y pantallas.', span: 'lg:col-span-2' },
  { icon: Footprints, name: 'Calzado', slug: 'calzado', text: 'Running, ciudad y montaña.', span: 'lg:col-span-2' },
  { icon: Watch, name: 'Accesorios', slug: 'accesorios', text: 'Relojes, mochilas y cuero.', span: 'lg:col-span-4' },
  { icon: Sofa, name: 'Hogar', slug: 'hogar', text: 'Madera, cerámica y luz cálida.', span: 'lg:col-span-3' },
  { icon: Dumbbell, name: 'Deporte', slug: 'deporte', text: 'Entrenamiento dentro y fuera.', span: 'lg:col-span-3' },
];

const STATS = [
  { value: '18', label: 'artículos' },
  { value: '10', label: 'marcas' },
  { value: '6', label: 'categorías' },
];

const STATEMENT =
  'No es un buscador con cien filtros. VØKTER entiende lo que necesitas y te deja frente al artículo correcto.';

// Divide un texto en palabras envueltas, para animarlas una a una.
function Words({ text, className = '', wordClassName = '' }) {
  return text.split(' ').map((word, i) => (
    <span key={i} className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${className}`}>
      <span className={`inline-block ${wordClassName}`}>{word}&nbsp;</span>
    </span>
  ));
}

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 font-mono text-xs text-sky">
      {children}
    </span>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const rootRef = useRef(null);

  useMotion(rootRef, () => {
    // 1. Hero: titular palabra a palabra, luego el resto, y la vitrina 3D entrando
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      // clearProps: sin transform residual, para no alterar la perspectiva de la vitrina 3D
      .from('.hero-stage', { opacity: 0, scale: 0.85, duration: 1.4, clearProps: 'transform,opacity' })
      .from('.hero-word', { yPercent: 115, duration: 1.1, stagger: 0.05 }, '-=1.1')
      .from('.hero-fade', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.7');

    // El hero se aleja (escala y se desvanece) mientras se hace scroll, estilo apple.com
    gsap.to('.hero-content', {
      yPercent: -18,
      scale: 0.92,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-glow', {
      scale: 1.4,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // 2. Frase manifiesto: las palabras se "encienden" con el scroll
    gsap.fromTo(
      '.statement-word',
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: '.statement', start: 'top 75%', end: 'bottom 45%', scrub: true },
      }
    );

    // 3. VOKTER AI: la tarjeta entra en escena como un producto. Sin scrub y con
    // clearProps: un transform residual rompería el background-attachment: fixed del GlowCard.
    gsap.from('.ai-stage', {
      scale: 0.88,
      y: 80,
      opacity: 0,
      duration: 1.3,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.ai-stage', start: 'top 85%', once: true },
    });

    // 4. Categorías: rejilla escalonada
    gsap.from('.category-card', {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      clearProps: 'transform,opacity', // un transform residual desplazaría el brillo del GlowCard
      scrollTrigger: { trigger: '.categories-grid', start: 'top 85%', once: true },
    });

    // 5. Cómo comprar: barra de progreso + pasos
    gsap.fromTo(
      '.steps-progress',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.steps-list', start: 'top 70%', end: 'bottom 60%', scrub: true },
      }
    );
    gsap.utils.toArray('.step-card').forEach((card) => {
      gsap.from(card, {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      });
    });

    // 6. App móvil: parallax del teléfono y sus tarjetas flotantes
    gsap.fromTo('.phone', { y: 120, rotate: -6 }, {
      y: -40,
      rotate: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.app-section', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.utils.toArray('.float-chip').forEach((chip, i) => {
      gsap.fromTo(chip, { y: 80 + i * 40 }, {
        y: -60 - i * 30,
        ease: 'none',
        scrollTrigger: { trigger: '.app-section', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Titulares de sección
    gsap.utils.toArray('.section-heading').forEach((el) => {
      gsap.from(el.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });
  });

  const primaryLinks = [
    { to: '/explorar', label: 'Ver el catálogo', icon: Compass },
    user
      ? { to: '/dashboard', label: 'Ir a mi panel', icon: LayoutDashboard }
      : { to: '/registro', label: 'Crear cuenta', icon: UserPlus },
    { to: '/descarga', label: 'Descargar app', icon: Smartphone },
  ];
  const secondaryLinks = user
    ? [{ to: '/favoritos', label: 'Mis favoritos' }]
    : [{ to: '/login', label: 'Ya tengo cuenta · Ingresar' }];

  return (
    <div ref={rootRef} className="-mt-16">
      {/* 1. Hero — vitrina 3D a la izquierda, texto a la derecha */}
      <section className="hero relative flex min-h-svh items-center overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="hero-glow pointer-events-none absolute left-[22%] top-[42%] h-[70vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(30,107,255,0.26),rgba(111,211,255,0.10)_55%,transparent)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        />

        <div className="hero-content relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
          {/* Izquierda: objeto 3D */}
          <div className="hero-stage order-1">
            <Showcase3D />
          </div>

          {/* Derecha: todo el texto, alineado a la derecha en escritorio */}
          <div className="order-2 text-center lg:text-right">
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {/* El degradado va en cada palabra: background-clip:text en un padre no pinta
                  bien a hijos con transform (Chrome) */}
              <span className="block">
                <Words text="Todo lo que buscas." wordClassName="hero-word text-gradient-mist" />
              </span>
              <span className="block">
                <Words text="En una sola frase." wordClassName="hero-word text-gradient-azure" />
              </span>
            </h1>

            <p className="hero-fade mt-7 max-w-md text-lg text-steel sm:text-xl lg:ml-auto">
              Ropa, tecnología, calzado, hogar. Describe lo que necesitas y VOKTER AI te lleva directo
              a la marca que lo tiene.
            </p>

            <div className="hero-fade mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-end">
              <Link
                to="/explorar"
                className="group inline-flex items-center gap-2 rounded-full bg-azure px-7 py-4 font-semibold text-mist shadow-[0_0_40px_-8px_rgba(30,107,255,0.9)] transition-all hover:scale-105 hover:bg-azureDeep active:scale-95"
              >
                Ver el catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a
                href="#vokter-ai"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-mist backdrop-blur transition-all hover:scale-105 hover:border-sky/40 hover:bg-white/10 active:scale-95"
              >
                Probar VOKTER AI
              </a>
            </div>

            <dl className="hero-fade mt-10 flex justify-center gap-8 lg:justify-end">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center lg:text-right">
                  <dt className="font-display text-3xl font-extrabold text-mist">{value}</dt>
                  <dd className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-steel">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="hero-fade absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-steel/70" aria-hidden="true">
          Desliza
          <span className="relative h-12 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-sky" />
          </span>
        </div>
      </section>

      {/* 2. Manifiesto */}
      <section className="statement mx-auto max-w-5xl px-6 py-32 sm:py-48">
        <p className="font-display text-3xl font-bold leading-tight tracking-tight text-mist sm:text-5xl lg:text-6xl">
          {STATEMENT.split(' ').map((word, i) => (
            <span key={i} className={`statement-word ${word === 'VØKTER' ? 'text-sky' : ''}`}>{word} </span>
          ))}
        </p>
      </section>

      {/* 3. VOKTER AI */}
      <section id="vokter-ai" className="ai-section mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
        <div className="section-heading mb-14 text-center">
          <div><Eyebrow><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Pruébalo ahora</Eyebrow></div>
          <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-mist sm:text-6xl">
            Pregúntale a <span className="text-gradient-azure">VOKTER AI.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-steel">
            Escribe lo que buscas como se lo contarías a alguien en la tienda. Te devolvemos las marcas
            con un porcentaje de coincidencia real.
          </p>
        </div>

        <div className="ai-stage">
          <GlowCard customSize glowColor="deep" className="w-full p-6 sm:p-10">
            <div className="relative">
              <AiMatchWidget variant="hero" />
            </div>
          </GlowCard>
        </div>
      </section>

      {/* 4. Categorías */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <div className="section-heading mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Categorías</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-mist sm:text-5xl">
              Compra por categoría.
            </h2>
          </div>
          <Link to="/explorar" className="group inline-flex items-center gap-2 text-sky hover:text-skySoft">
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="categories-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {CATEGORIES.map(({ icon: Icon, name, slug, text, span }) => (
            <GlowCard
              key={slug}
              as={Link}
              to={`/explorar?categoria=${slug}`}
              customSize
              className={`category-card group flex min-h-[220px] flex-col justify-between p-7 ${span}`}
            >
              <div className="relative flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-sky ring-1 ring-white/10 transition-colors group-hover:bg-azure group-hover:text-mist">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <ArrowUpRight className="h-6 w-6 text-steel transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-sky" aria-hidden="true" />
              </div>
              <div className="relative">
                <h3 className="font-display text-2xl font-bold text-mist">{name}</h3>
                <p className="mt-1 text-steel">{text}</p>
              </div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* 5. Cómo comprar */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div className="section-heading lg:sticky lg:top-32 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky">Cómo comprar</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-mist sm:text-5xl">
              Tres pasos.
              <br />
              <span className="text-steel">Cero filtros.</span>
            </h2>
            <p className="mt-6 max-w-sm text-steel">
              De la frase que tienes en la cabeza al artículo que buscabas, sin recorrer veinte páginas
              de resultados.
            </p>
          </div>

          <div className="steps-list relative">
            <div className="absolute bottom-0 left-[1.6rem] top-0 hidden w-px bg-white/10 sm:block" aria-hidden="true">
              <div className="steps-progress h-full w-full origin-top bg-gradient-to-b from-azure to-sky" />
            </div>
            <ol className="flex flex-col gap-8">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="step-card sm:pl-16">
                  <GlowCard customSize className="p-8">
                    <div className="relative flex items-start gap-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-azure/15 text-sky ring-1 ring-sky/30">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <span className="font-mono text-xs text-sky">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="mt-1 font-display text-2xl font-bold text-mist">{title}</h3>
                        <p className="mt-2 text-steel">{text}</p>
                      </div>
                    </div>
                  </GlowCard>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 6. App móvil */}
      <section className="app-section mx-auto max-w-6xl overflow-hidden px-6 py-32">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-surface2 via-surface to-ink">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-azure/25 blur-[100px]" />
          <div className="grid items-center gap-10 p-10 sm:p-16 lg:grid-cols-2">
            <div className="section-heading relative">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky">App Android</p>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-mist sm:text-5xl">
                La tienda en tu bolsillo.
              </h2>
              <p className="mt-5 max-w-md text-lg text-steel">
                La misma cuenta, los mismos favoritos y VOKTER AI en el móvil. Lo que guardes en la web
                te espera en la app.
              </p>
              <div className="mt-8">
                <Link
                  to="/descarga"
                  className="group inline-flex items-center gap-2 rounded-full bg-mist px-7 py-4 font-semibold text-ink transition-all hover:scale-105 hover:bg-white active:scale-95"
                >
                  <Smartphone className="h-5 w-5" aria-hidden="true" />
                  Descargar app
                </Link>
              </div>
            </div>

            <div className="relative flex h-[420px] justify-center" aria-hidden="true">
              <div className="phone relative h-[420px] w-[210px] rounded-[2.5rem] border border-white/15 bg-ink p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
                <div className="mx-auto mb-4 h-5 w-20 rounded-full bg-surface2" />
                <div className="space-y-3 px-1">
                  <div className="h-3 w-24 rounded-full bg-white/20" />
                  <div className="h-9 rounded-full border border-white/10 bg-surface2" />
                  {[92, 78, 64].map((score) => (
                    <div key={score} className="rounded-2xl border border-white/10 bg-surface p-3">
                      <div className="flex items-center justify-between">
                        <div className="h-2.5 w-16 rounded-full bg-white/25" />
                        <span className="rounded-full bg-sky/15 px-2 py-0.5 font-mono text-[9px] text-sky">{score}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-white/10" />
                      <div className="mt-1.5 h-2 w-2/3 rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="float-chip absolute left-0 top-16 rounded-2xl border border-white/10 bg-surface2/90 px-4 py-3 text-xs text-mist shadow-xl backdrop-blur sm:left-6">
                <span className="text-sky">★</span> Favoritos sincronizados
              </div>
              <div className="float-chip absolute bottom-20 right-0 rounded-2xl border border-sky/30 bg-sky/15 px-4 py-3 font-mono text-xs text-sky shadow-xl backdrop-blur sm:right-6">
                92% match
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Cierre: telón hacia el resto de la tienda */}
      <CinematicFooter heading="¿Empezamos a buscar?" primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} />
    </div>
  );
}
