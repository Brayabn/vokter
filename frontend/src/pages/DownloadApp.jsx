import { QRCodeSVG } from 'qrcode.react';
import { Check, Download, Globe, PackageOpen, Smartphone } from 'lucide-react';
import { APK_URL, APK_VERSION, APK_MIN_ANDROID } from '../config/app';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';

const STEPS = [
  { title: 'Descarga el APK', text: 'Toca "Descargar aplicación" desde el teléfono, o escanea el código con la cámara de tu Android.' },
  { title: 'Permite la instalación', text: 'Android pedirá autorizar la instalación desde el navegador ("orígenes desconocidos"). Es normal en apps fuera de Play Store.' },
  { title: 'Instala y abre', text: 'Si Play Protect muestra un aviso, elige "Instalar de todas formas". Luego abre VØKTER.' },
  { title: 'Ingresa', text: 'Usa tu misma cuenta de la web o la cuenta demo: demo@vokter.com — vokter123.' },
];

const FEATURES = [
  'VOKTER AI: describe lo que buscas y encuentra la marca que lo vende',
  'Recorre el catálogo y las marcas por categoría',
  'Favoritos sincronizados con tu cuenta web',
];

// Las dos superficies de VØKTER. Misma marca, misma cuenta y mismo catálogo:
// cambia el formato, no el producto.
const PLATFORMS = [
  {
    icon: Globe,
    name: 'Versión web',
    tag: 'Cualquier navegador',
    points: ['Catálogo completo de las diez marcas', 'VOKTER AI y búsqueda por categoría', 'Tema claro y oscuro'],
  },
  {
    icon: Smartphone,
    name: 'App Android',
    tag: 'React Native',
    points: ['El mismo catálogo, hecho para el móvil', 'Sesión guardada de forma cifrada en el teléfono', 'Favoritos compartidos con la web'],
  },
];

// Marco de teléfono: ilustración de marca, no una captura de pantalla.
// Cuando se publique el APK con el diseño nuevo, aquí van las capturas reales
// de la app (docs/screenshots) en lugar del logotipo.
//
// Los colores van fijos y no por tokens del tema: representa un teléfono real,
// y con los tokens el marco se volvía casi blanco en tema claro y dejaba de
// leerse como un dispositivo.
function PhoneFrame() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-64 w-[132px] shrink-0 rounded-[1.75rem] border border-white/10 bg-[#0B1120] p-1.5 shadow-[0_18px_40px_-18px_rgba(4,7,13,0.65)]"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-[#16213A] to-[#04070D]">
        <span className="font-display text-sm font-extrabold tracking-tight text-[#F2F8FF]">
          V<span className="text-[#6FD3FF]">Ø</span>KTER
        </span>
        <span className="h-px w-8 bg-[#6FD3FF]/40" />
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#8DA2BF]">Android</span>
      </div>
      {/* Isla superior del teléfono */}
      <span className="absolute left-1/2 top-3 h-1.5 w-10 -translate-x-1/2 rounded-full bg-[#04070D]" />
    </div>
  );
}

export default function DownloadApp() {
  return (
    <div className="relative overflow-hidden">
      {/* Halo ambiental detrás de la tarjeta de descarga */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-10 h-[520px] w-[520px] max-w-full rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.16),transparent_65%)] blur-2xl"
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-sky mb-5">
              <Smartphone aria-hidden="true" className="h-4 w-4" />
              App Android{APK_VERSION ? ` · v${APK_VERSION}` : ''}
            </p>
            <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist mb-4">
              Lleva <span className="text-gradient-azure">VØKTER</span> contigo
            </h1>
            <p className="text-steel text-lg mb-8 max-w-md">
              La app Android es la misma tienda que estás viendo, hecha para el teléfono: el catálogo de las
              diez marcas, VOKTER AI y tus favoritos, con la misma cuenta. Lo que guardes en un lugar te
              espera en el otro.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-mist">
                  <Check aria-hidden="true" className="h-4 w-4 text-sky mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <dl className="grid grid-cols-2 gap-4 max-w-sm text-sm">
              <div className="rounded-xl bg-surface border border-hairline/10 p-4">
                <dt className="text-xs font-mono text-steel mb-1">Versión</dt>
                {/* Sin APK publicado no se anuncia número de versión (ver config/app.js) */}
                <dd className="text-mist font-semibold">{APK_VERSION || 'Por publicar'}</dd>
              </div>
              <div className="rounded-xl bg-surface border border-hairline/10 p-4">
                <dt className="text-xs font-mono text-steel mb-1">Compatibilidad</dt>
                <dd className="text-mist font-semibold">{APK_MIN_ANDROID}</dd>
              </div>
            </dl>
          </Reveal>

          <div className="flex justify-center">
            {APK_URL ? (
              <GlowCard customSize className="w-full max-w-sm p-8 sm:p-10">
                <div className="relative flex flex-col items-center gap-6">
                  {/* El botón va primero en el teléfono (donde el QR no sirve de nada)
                      y debajo del código en pantallas grandes. */}
                  <a
                    href={APK_URL}
                    className="order-first sm:order-none w-full inline-flex items-center justify-center gap-2 rounded-full bg-azure text-onAccent font-semibold px-8 py-3.5 shadow-[0_0_30px_-10px_rgba(30,107,255,0.8)] hover:bg-azureDeep transition-colors"
                  >
                    <Download aria-hidden="true" className="h-4 w-4" />
                    Descargar aplicación
                  </a>

                  {/* El QR codifica exactamente la misma URL que el botón */}
                  <figure className="order-last sm:order-first m-0 flex flex-col items-center gap-3">
                    <div className="bg-white p-4 rounded-2xl">
                      <QRCodeSVG
                        value={APK_URL}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#04070D"
                        level="M"
                        role="img"
                        aria-label="Código QR con el enlace de descarga del APK de VØKTER para Android"
                      />
                    </div>
                    <figcaption className="text-sm text-steel text-center">
                      Escanea con la cámara de tu Android
                    </figcaption>
                  </figure>

                  <p className="order-last text-xs text-steel text-center">
                    Solo Android · se descarga desde GitHub Releases
                  </p>
                </div>
              </GlowCard>
            ) : (
              <GlowCard customSize className="w-full max-w-sm p-10 text-center" role="status">
                <div className="relative">
                  <PackageOpen aria-hidden="true" className="h-10 w-10 text-sky mx-auto mb-3" />
                  <p className="text-mist font-semibold mb-2">Descarga no disponible todavía</p>
                  <p className="text-sm text-steel">
                    El instalador de Android aún no está publicado. Vuelve a intentarlo más tarde.
                  </p>
                </div>
              </GlowCard>
            )}
          </div>
        </div>

        {/* Integración conceptual: web y app son el mismo producto en dos formatos */}
        <section className="mt-20 border-t border-hairline/10 pt-12">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky mb-3">Una sola solución</p>
            <h2 className="font-display font-extrabold tracking-tight text-3xl sm:text-4xl text-mist mb-4">
              Dos formas de usar VØKTER
            </h2>
            <p className="text-steel max-w-2xl mb-8">
              La web y la aplicación comparten marca, catálogo y cuenta. No son dos productos: son la misma
              tienda adaptada a cada pantalla.
            </p>
          </Reveal>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <Reveal className="grid sm:grid-cols-2 gap-6 flex-1">
              {PLATFORMS.map(({ icon: Icon, name, tag, points }) => (
                <div key={name} className="rounded-2xl bg-surface border border-hairline/10 p-6">
                  <Icon aria-hidden="true" className="h-6 w-6 text-sky mb-4" />
                  <h3 className="font-display font-semibold text-lg text-mist">{name}</h3>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-steel mb-4">{tag}</p>
                  <ul className="flex flex-col gap-2">
                    {points.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-steel">
                        <Check aria-hidden="true" className="h-3.5 w-3.5 text-sky mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
            <div className="hidden lg:block">
              <PhoneFrame />
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-hairline/10 pt-12">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky mb-3">Paso a paso</p>
            <h2 className="font-display font-extrabold tracking-tight text-3xl sm:text-4xl text-mist mb-8">
              Cómo instalarla
            </h2>
          </Reveal>
          <Reveal as="ol" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-2xl bg-surface border border-hairline/10 p-5">
                <span className="block font-display font-extrabold text-5xl leading-none text-gradient-azure">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display font-semibold text-mist mt-4 mb-2">{step.title}</h3>
                <p className="text-sm text-steel">{step.text}</p>
              </li>
            ))}
          </Reveal>
          <p className="text-xs text-steel mt-6">
            ¿Usas iPhone? Por ahora VØKTER móvil está disponible solo para Android; puedes usar la versión web
            desde el navegador.
          </p>
        </section>
      </div>
    </div>
  );
}
