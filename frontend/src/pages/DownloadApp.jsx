import { QRCodeSVG } from 'qrcode.react';
import { Check, Download, PackageOpen, Smartphone } from 'lucide-react';
import { APK_URL, APK_VERSION, APK_MIN_ANDROID } from '../config/app';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';

const STEPS = [
  { title: 'Descarga el APK', text: 'Escanea el código con la cámara de tu Android o toca "Descargar APK" desde el teléfono.' },
  { title: 'Permite la instalación', text: 'Android pedirá autorizar la instalación desde el navegador ("orígenes desconocidos"). Es normal en apps fuera de Play Store.' },
  { title: 'Instala y abre', text: 'Si Play Protect muestra un aviso, elige "Instalar de todas formas". Luego abre VØKTER.' },
  { title: 'Ingresa', text: 'Usa tu misma cuenta de la web o la cuenta demo: demo@vokter.com — vokter123.' },
];

const FEATURES = [
  'VOKTER AI: describe lo que buscas y encuentra la marca que lo vende',
  'Recorre el catálogo y las marcas por categoría',
  'Favoritos sincronizados con tu cuenta web',
];

export default function DownloadApp() {
  return (
    <div className="relative overflow-hidden">
      {/* Resplandor dorado decorativo detrás del QR */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-10 h-[520px] w-[520px] max-w-full rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.16),transparent_65%)] blur-2xl"
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-sky mb-5">
              <Smartphone aria-hidden="true" className="h-4 w-4" />
              App Android · v{APK_VERSION}
            </p>
            <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist mb-4">
              Lleva <span className="text-gradient-azure">VØKTER</span> contigo
            </h1>
            <p className="text-steel text-lg mb-8 max-w-md">
              La app usa la misma cuenta y el mismo catálogo que la web: el artículo que guardes en un
              lugar te espera en el otro.
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
              <div className="rounded-xl bg-surface border border-white/10 p-4">
                <dt className="text-xs font-mono text-steel mb-1">Versión</dt>
                <dd className="text-mist font-semibold">{APK_VERSION}</dd>
              </div>
              <div className="rounded-xl bg-surface border border-white/10 p-4">
                <dt className="text-xs font-mono text-steel mb-1">Compatibilidad</dt>
                <dd className="text-mist font-semibold">{APK_MIN_ANDROID}</dd>
              </div>
            </dl>
          </Reveal>

          <div className="flex justify-center">
            {APK_URL ? (
              <GlowCard customSize className="w-full max-w-sm p-8 sm:p-10">
                <div className="relative flex flex-col items-center gap-6">
                  <div className="bg-white p-4 rounded-2xl">
                    {/* El QR codifica exactamente la misma URL que el botón */}
                    <QRCodeSVG value={APK_URL} size={200} bgColor="#ffffff" fgColor="#04070D" level="M" />
                  </div>
                  <p className="text-sm text-steel text-center">Escanea con la cámara de tu Android</p>
                  <a
                    href={APK_URL}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-azure text-mist font-semibold px-8 py-3.5 shadow-[0_0_30px_-10px_rgba(30,107,255,0.8)] hover:bg-azureDeep transition-colors"
                  >
                    <Download aria-hidden="true" className="h-4 w-4" />
                    Descargar APK
                  </a>
                  <p className="text-xs text-steel text-center">
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

        <section className="mt-20 border-t border-white/10 pt-12">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky mb-3">Paso a paso</p>
            <h2 className="font-display font-extrabold tracking-tight text-3xl sm:text-4xl text-mist mb-8">
              Cómo instalarla
            </h2>
          </Reveal>
          <Reveal as="ol" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-2xl bg-surface border border-white/10 p-5">
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
