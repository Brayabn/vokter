const espn = require('./espnProvider');
const openliga = require('./openLigaProvider');
const sportsdb = require('./sportsDbProvider');
const openfootball = require('./openFootballProvider');

/**
 * Registro de proveedores deportivos.
 *
 * VOKTER no depende de una sola fuente: cada proveedor es un módulo con la
 * misma interfaz (`obtenerPartidos`, `probarCobertura`) y el resto del sistema
 * no sabe de cuál viene cada dato más allá del campo `fuente`, que se conserva
 * siempre para poder decir de dónde sale cada marcador.
 *
 * Todas las fuentes aquí son públicas, de lectura y sin clave ni registro.
 * Coste de proveedores deportivos: 0.
 *
 * Para añadir una fuente nueva basta con crear su módulo y meterlo en esta
 * lista: ni las rutas ni las pantallas cambian.
 */
/**
 * Proveedores ACTIVOS: los que de verdad responden desde el servidor.
 *
 * ESPN y TheSportsDB quedan fuera del ciclo aunque funcionen desde un
 * navegador: comprobado contra produccion, los dos devuelven 403 a las IPs de
 * centro de datos donde corre Render. Dejarlos activos solo serviria para
 * lanzar peticiones condenadas a fallar cada minuto. Sus adaptadores se
 * conservan porque el bloqueo es por IP y podria levantarse, o servir si el
 * backend se mueve a otra infraestructura.
 */
const PROVEEDORES = [openliga, openfootball];

// Se siguen sondeando en /diag para dejar constancia de su estado real.
const NO_ALCANZABLES = [espn, sportsdb];

const porId = (id) => PROVEEDORES.find((p) => p.id === id) || null;

/** Todas las competiciones declaradas, ordenadas por prioridad. */
function competicionesDeclaradas() {
  return PROVEEDORES.flatMap((p) =>
    p.COMPETICIONES.map((c) => ({ ...c, proveedor: p.id }))
  ).sort((a, b) => a.prioridad - b.prioridad);
}

/**
 * Pregunta a cada proveedor qué competiciones responden de verdad.
 * Un proveedor caído no tumba al resto: se registra su error y se sigue.
 */
async function probarTodo() {
  const informe = [];
  for (const p of [...PROVEEDORES, ...NO_ALCANZABLES]) {
    const inicio = Date.now();
    try {
      const cobertura = await p.probarCobertura();
      informe.push({
        proveedor: p.id,
        etiqueta: p.etiqueta,
        atribucion: p.atribucion,
        alcanzable: cobertura.some((c) => c.disponible),
        ms: Date.now() - inicio,
        cobertura,
      });
    } catch (e) {
      informe.push({
        proveedor: p.id,
        etiqueta: p.etiqueta,
        alcanzable: false,
        ms: Date.now() - inicio,
        error: e.message,
        cobertura: [],
      });
    }
  }
  return informe;
}

module.exports = { PROVEEDORES, NO_ALCANZABLES, porId, competicionesDeclaradas, probarTodo };
