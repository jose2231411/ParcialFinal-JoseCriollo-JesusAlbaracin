// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene un Pedido y qué reglas deben cumplir.
// No sabe nada de HTTP ni de bases de datos.
// =====================================================================

const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;
const ESTADOS_VALIDOS = ['pendiente', 'enviado', 'entregado'];

function validarPedido(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos del pedido'];
  }
  if (!datos.numero || typeof datos.numero !== 'string' || datos.numero.trim() === '') {
    errores.push('numero es obligatorio');  
  }
  if (
    (typeof datos.cantidad !== 'string' && typeof datos.cantidad !== 'number') ||
    !Number.isInteger(Number(datos.cantidad)) ||
    Number(datos.cantidad) <= 0
  ) {
    errores.push('cantidad es obligatoria y debe ser un entero mayor a 0');
  }
  if (!datos.cliente || typeof datos.cliente !== 'string' || datos.cliente.trim() === '') {
    errores.push('cliente es obligatorio y debe ser una cadena de texto');
  }
  if (typeof datos.fecha !== 'string' || !FECHA_VALIDA.test(datos.fecha)) {
    errores.push('fecha es obligatoria y debe ser una fecha válida');
  }
  if (typeof datos.estado !== 'string' || !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.push('estado es obligatorio y debe ser uno de los siguientes: pendiente, enviado, entregado');
  }
  return errores;
}

// Construye un pedido limpio con los campos permitidos.
function construirPedido(datos) {
  return {
    numero: datos.numero.trim(),
    cliente: datos.cliente.trim(),
    cantidad: parseInt(datos.cantidad),
    fecha: datos.fecha,
    estado: datos.estado,
  };
}

module.exports = { validarPedido, construirPedido };
