// Configuración pública de la web (Vite incrusta las variables VITE_* al compilar).

/**
 * URL pública del APK, en la release de GitHub. La usan el botón Y el QR de
 * /descarga: una única fuente, para que no puedan apuntar a sitios distintos.
 *
 * Vive en el repositorio y no en una variable de entorno a propósito. El enlace
 * de una release es público y estable, así que tenerlo aquí lo deja versionado
 * junto al código y revisable en el diff. Cuando dependía de `VITE_APK_URL` en
 * el panel de Vercel se quedó atrás respecto a la versión publicada y la página
 * llegó a ofrecer un APK que no correspondía.
 *
 * Esta constante MANDA sobre `VITE_APK_URL`. El orden inverso no sirve: la
 * variable que quedo configurada en Vercel sigue apuntando a una release
 * antigua, asi que si tuviera prioridad seguiria entregando ese APK por mucho
 * que aqui se publique otro. La variable solo se usa si esta constante queda
 * vacia, como valvula de escape para un entorno de pruebas.
 */
const APK_RELEASE_URL = 'https://github.com/Brayabn/vokter/releases/download/v1.2.0/VOKTER-v1.2.0.apk';

const rawApkUrl = APK_RELEASE_URL.trim() || (import.meta.env.VITE_APK_URL || '').trim();

// Solo se acepta una URL HTTPS: un QR hacia localhost o una IP privada no le sirve a nadie.
export const APK_URL = /^https:\/\//i.test(rawApkUrl) ? rawApkUrl : null;

// La versión que se anuncia se DEDUCE de la URL del release, que lleva la
// etiqueta en la ruta (.../releases/download/v1.2.0/...). Así la página no puede
// anunciar una versión distinta del archivo que de verdad entrega.
const versionEnLaUrl = (APK_URL || '').match(/\/download\/v?([\d][\w.-]*)\//);
const versionDeclarada = (import.meta.env.VITE_APK_VERSION || '').trim();

if (versionEnLaUrl && versionDeclarada && versionEnLaUrl[1] !== versionDeclarada) {
  console.warn(
    `VITE_APK_VERSION ("${versionDeclarada}") no coincide con el APK publicado ("${versionEnLaUrl[1]}"). ` +
      'Se anuncia la del archivo para no prometer una versión que no se entrega.'
  );
}

// Sin URL válida no se anuncia ninguna versión: /descarga muestra "no disponible".
export const APK_VERSION = APK_URL ? (versionEnLaUrl ? versionEnLaUrl[1] : versionDeclarada || null) : null;

// Requisito real del build (Expo SDK 57: minSdk 24 = Android 7.0).
export const APK_MIN_ANDROID = 'Android 7.0 o superior';
