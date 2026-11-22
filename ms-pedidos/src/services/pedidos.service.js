// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/pedidos.repository');
const { validarPedido, construirPedido, ESTADOS_VALIDOS } = require('../models/pedido');
const HttpError = require('../utils/http-error');

// GET /pedidos con filtros opcionales ?estado= y ?ids=
async function listar(filtros) {
  if (filtros.estado !== undefined && !ESTADOS_VALIDOS.includes(filtros.estado)) {
    throw new HttpError(400, `El filtro estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  return repo.findAll(filtros);
}

async function obtener(id) {
  const pedido = await repo.findById(id);
  if (!pedido) throw new HttpError(404, `No existe el pedido con id ${id}`);
  return pedido;
}

async function crear(datos) {
  const errores = validarPedido(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const pedido = construirPedido(datos);

  // Regla de negocio: el número de pedido es único.
  if (await repo.findByNumero(pedido.numero)) {
    throw new HttpError(409, `Ya existe un pedido con el número ${pedido.numero}`);
  }

  return repo.create(pedido);
}

async function actualizar(id, datos) {
  const errores = validarPedido(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  // Primero se comprueba que exista (404) y después la unicidad (409).
  if (!(await repo.findById(id))) throw new HttpError(404, `No existe el pedido con id ${id}`);

  const pedido = construirPedido(datos);

  // Regla de negocio: el número no puede estar en uso por OTRO pedido.
  const otro = await repo.findByNumero(pedido.numero);
  if (otro && otro.id !== id) {
    throw new HttpError(409, `Ya existe un pedido con el número ${pedido.numero}`);
  }

  return repo.update(id, pedido);
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) throw new HttpError(404, `No existe el pedido con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
