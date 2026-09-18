import { QRCodeSVG } from 'qrcode.react';
import { APK_URL, APK_VERSION, APK_MIN_ANDROID } from '../config/app';

const STEPS = [
  { title: 'Descarga el APK', text: 'Escanea el código con la cámara de tu Android o toca "Descargar APK" desde el teléfono.' },
  { title: 'Permite la instalación', text: 'Android pedirá autorizar la instalación desde el navegador ("orígenes desconocidos"). Es normal en apps fuera de Play Store.' },
  { title: 'Instala y abre', text: 'Si Play Protect muestra un aviso, elige "Instalar de todas formas". Luego abre VØKTER.' },
  { title: 'Ingresa', text: 'Usa tu misma cuenta de la web o la cuenta demo: demo@vokter.com — vokter123.' },
];

const FEATURES = [
  'VOKTER AI: describe lo que necesitas y encuentra al experto afín',
  'Explora contenidos y expertos por categoría',
  'Favoritos sincronizados con tu cuenta web',
];

export default function DownloadApp() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-mono text-gold border border-gold/30 rounded-full px-3 py-1 mb-5">
            App Android · v{APK_VERSION}
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-mist mb-4">
            Lleva VØKTER contigo
          </h1>
          <p className="text-lavender mb-8 max-w-md">
            La app móvil usa la misma cuenta y los mismos datos que la web: lo que guardes en un lugar
            aparece en el otro.
          </p>
          <ul className="flex flex-col gap-3 mb-8">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-mist">
                <span className="text-gold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <dl className="grid grid-cols-2 gap-4 max-w-sm text-sm">
            <div className="rounded-xl bg-surface border border-white/5 p-4">
              <dt className="text-xs font-mono text-lavender mb-1">Versión</dt>
              <dd className="text-mist font-semibold">{APK_VERSION}</dd>
            </div>
            <div className="rounded-xl bg-surface border border-white/5 p-4">
              <dt className="text-xs font-mono text-lavender mb-1">Compatibilidad</dt>
              <dd className="text-mist font-semibold">{APK_MIN_ANDROID}</dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-center">
          {APK_URL ? (
            <div className="flex flex-col items-center gap-6 rounded-3xl bg-surface border border-white/5 p-8 sm:p-10 w-full max-w-sm">
              <div className="bg-white p-4 rounded-2xl">
                {/* El QR codifica exactamente la misma URL que el botón */}
                <QRCodeSVG value={APK_URL} size={200} bgColor="#ffffff" fgColor="#12172B" level="M" />
              </div>
              <p className="text-sm text-lavender text-center">Escanea con la cámara de tu Android</p>
              <a
                href={APK_URL}
                className="w-full text-center rounded-full bg-gold text-ink font-semibold px-8 py-3.5 hover:bg-goldSoft transition-colors"
              >
                Descargar APK
              </a>
              <p className="text-xs text-lavender text-center">
                Solo Android · se descarga desde GitHub Releases
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-surface border border-white/5 p-10 w-full max-w-sm text-center" role="status">
              <p className="text-3xl mb-3">📦</p>
              <p className="text-mist font-semibold mb-2">Descarga no disponible todavía</p>
              <p className="text-sm text-lavender">
                El instalador de Android aún no está publicado. Vuelve a intentarlo más tarde.
              </p>
            </div>
          )}
        </div>
      </div>

      <section className="mt-20 border-t border-white/5 pt-12">
        <h2 className="font-display font-bold text-2xl text-mist mb-8">Cómo instalarla</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl bg-surface border border-white/5 p-5">
              <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display font-semibold text-mist mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-lavender">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-xs text-lavender mt-6">
          ¿Usas iPhone? Por ahora VØKTER móvil está disponible solo para Android; puedes usar la versión web
          desde el navegador.
        </p>
      </section>
    </div>
  );
}
