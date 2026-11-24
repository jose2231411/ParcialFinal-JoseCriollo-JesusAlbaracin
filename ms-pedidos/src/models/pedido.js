// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene un Pedido y qué reglas deben cumplir.
// No sabe nada de HTTP ni de bases de datos.
// =====================================================================

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const ESTADOS_VALIDOS = ['pendiente', 'enviado', 'entregado'];

function textoValido(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// Formato AAAA-MM-DD y además una fecha que exista (rechaza 2026-02-30).
function fechaValida(valor) {
  if (typeof valor !== 'string' || !FORMATO_FECHA.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

// Entero mayor que 0 (acepta 10 o "10", rechaza 0, -3, 2.5, "abc").
function enteroPositivo(valor) {
  if (typeof valor !== 'number' && typeof valor !== 'string') return false;
  if (typeof valor === 'string' && valor.trim() === '') return false;
  const n = Number(valor);
  return Number.isInteger(n) && n > 0;
}

// Devuelve la lista de errores (vacía si los datos son válidos).
function validarPedido(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return ['Se esperaba un objeto JSON con los datos del pedido'];
  }
  const errores = [];
  if (!textoValido(datos.numero)) errores.push('numero es obligatorio y debe ser texto');
  if (!textoValido(datos.cliente)) errores.push('cliente es obligatorio y debe ser texto');
  if (!enteroPositivo(datos.cantidad)) errores.push('cantidad es obligatoria y debe ser un entero mayor que 0');
  if (!fechaValida(datos.fecha)) errores.push('fecha es obligatoria y debe ser una fecha válida con formato AAAA-MM-DD');
  if (!ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.push(`estado es obligatorio y debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  if (!enteroPositivo(datos.bodega_id)) errores.push('bodega_id es obligatorio y debe ser un entero mayor que 0');
  return errores;
}

// Construye un pedido limpio solo con los campos permitidos.
function construirPedido(datos) {
  return {
    numero: datos.numero.trim(),
    cliente: datos.cliente.trim(),
    cantidad: Number(datos.cantidad),
    fecha: datos.fecha,
    estado: datos.estado,
    bodega_id: Number(datos.bodega_id),
  };
}

module.exports = { validarPedido, construirPedido, ESTADOS_VALIDOS };
