/**
 * Cliente HTTP compartido por los proveedores deportivos.
 *
 * Todas las fuentes que usa VOKTER son públicas y de solo lectura, pero son de
 * terceros: pueden tardar, caerse o cambiar sin avisar. Este cliente acota ese
 * riesgo para que una fuente lenta nunca bloquee el backend.
 *
 * La verificación TLS se deja como viene por defecto. No se desactiva nunca,
 * ni siquiera para diagnosticar: una respuesta que no se puede autenticar no
 * sirve para mostrar marcadores.
 */

const TIMEOUT_MS = Number(process.env.SPORTS_HTTP_TIMEOUT_MS || 12000);
const REINTENTOS = Number(process.env.SPORTS_HTTP_RETRIES || 2);

// Identificarse es lo correcto con un API público y ayuda a que el proveedor
// pueda contactar si algo molesta.
const USER_AGENT = 'VOKTER/1.0 (+https://vokter-web.vercel.app)';

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET con tiempo límite y reintentos. Devuelve el JSON ya parseado.
 * Lanza un Error con `.status` y `.source` para que el llamador decida.
 */
async function getJson(url, { source = 'desconocida', timeoutMs = TIMEOUT_MS, retries = REINTENTOS } = {}) {
  let ultimoError;

  for (let intento = 0; intento <= retries; intento += 1) {
    const control = new AbortController();
    const corte = setTimeout(() => control.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: control.signal,
        headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
      });

      if (!res.ok) {
        const err = new Error(`${source} respondió ${res.status}`);
        err.status = res.status;
        err.source = source;
        // 4xx no se reintenta: la petición está mal, repetirla no la arregla.
        if (res.status >= 400 && res.status < 500) throw err;
        ultimoError = err;
      } else {
        return await res.json();
      }
    } catch (e) {
      if (e.status >= 400 && e.status < 500) throw e;
      ultimoError = e;
    } finally {
      clearTimeout(corte);
    }

    // Espera creciente entre reintentos, para no castigar a un proveedor caído.
    if (intento < retries) await dormir(500 * (intento + 1));
  }

  const err = new Error(`${source}: ${ultimoError ? ultimoError.message : 'sin respuesta'}`);
  err.source = source;
  err.cause = ultimoError;
  throw err;
}

module.exports = { getJson, TIMEOUT_MS, REINTENTOS, USER_AGENT };
