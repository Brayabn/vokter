// Configuración pública de la web (Vite incrusta las variables VITE_* al compilar).

// URL pública del APK (GitHub Release). La usan el botón Y el QR de /descarga:
// una única fuente para que nunca apunten a sitios distintos.
const rawApkUrl = (import.meta.env.VITE_APK_URL || '').trim();

// Solo se acepta una URL HTTPS: un QR hacia localhost o una IP privada no le sirve a nadie.
export const APK_URL = /^https:\/\//i.test(rawApkUrl) ? rawApkUrl : null;

export const APK_VERSION = import.meta.env.VITE_APK_VERSION || '1.0.0';

// Requisito real del build (Expo SDK 57: minSdk 24 = Android 7.0).
export const APK_MIN_ANDROID = 'Android 7.0 o superior';
