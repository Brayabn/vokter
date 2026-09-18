// Convierte un parámetro de ruta a id entero positivo; null si no es válido.
// Evita que PostgreSQL falle con "invalid input syntax for type integer" (500)
// cuando llega algo como /contents/abc: se responde 404 en su lugar.
function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

module.exports = { parseId };
