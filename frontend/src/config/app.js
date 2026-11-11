// Configuración pública de la web (Vite incrusta las variables VITE_* al compilar).

// URL pública del APK (GitHub Release). La usan el botón Y el QR de /descarga:
// una única fuente para que nunca apunten a sitios distintos.
const rawApkUrl = (import.meta.env.VITE_APK_URL || '').trim();

// Solo se acepta una URL HTTPS: un QR hacia localhost o una IP privada no le sirve a nadie.
export const APK_URL = /^https:\/\//i.test(rawApkUrl) ? rawApkUrl : null;

// La versión que se anuncia se DEDUCE de la URL del release, que lleva la
// etiqueta en la ruta (.../releases/download/v1.0.0/...). Así la página no puede
// anunciar una versión distinta del archivo que de verdad entrega: antes
// VITE_APK_VERSION era independiente de VITE_APK_URL y podía quedarse
// desactualizada respecto al release publicado.
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
