import { QRCodeSVG } from 'qrcode.react';

// TODO (Día 4): reemplazar por el link real del APK subido a GitHub Releases.
const APK_DOWNLOAD_URL = 'https://github.com/tu-usuario/vokter/releases/latest/download/vokter.apk';

export default function DownloadApp() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-mist mb-3">
        Lleva VØKTER contigo
      </h1>
      <p className="text-lavender mb-12 max-w-md mx-auto">
        Escanea el código con tu celular Android o toca el botón para descargar el instalador.
      </p>

      <div className="inline-flex flex-col items-center gap-6 rounded-3xl bg-surface border border-white/5 p-10">
        <div className="bg-white p-4 rounded-2xl">
          <QRCodeSVG value={APK_DOWNLOAD_URL} size={180} bgColor="#ffffff" fgColor="#12172B" />
        </div>
        <a
          href={APK_DOWNLOAD_URL}
          className="rounded-full bg-gold text-ink font-semibold px-8 py-3.5 hover:bg-goldSoft transition-colors"
        >
          Descargar APK
        </a>
        <p className="text-xs text-lavender max-w-xs">
          Android te pedirá permitir "instalar apps de orígenes desconocidos" la primera vez — es normal para apps fuera de Play Store.
        </p>
      </div>
    </div>
  );
}
