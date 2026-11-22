// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/pedidos.repository');
const { validarPedido, construirPedido } = require('../models/pedido');
const HttpError = require('../utils/http-error');

async function listar(filtros) {
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

  // Regla de negocio: el número de pedido debe ser único.
  if (await repo.findByNumero(pedido.numero)) {
    throw new HttpError(409, `Ya existe un pedido con el número ${pedido.numero}`);
  }

  return repo.create(pedido);
}

async function actualizar(id, pedido) {
  const errores = validarPedido(pedido);
  if (errores.length > 0) {
    throw new HttpError(400, errores.join(', '));
  };
  const datos = construirPedido(pedido);
  const existente = await repo.findByNumero(datos.numero);

  if (existente && existente.id !== id) {
    throw new HttpError(409, `Ya existe un pedido con el número ${datos.numero}`);
  }

  const actualizado = await repo.update(id, datos);
  if (!actualizado) {
    throw new HttpError(404, `No existe un pedido con id ${id}`);
  };
  return actualizado;
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) {
    throw new HttpError(404, `No existe un pedido con id ${id}`);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
