// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las reglas del negocio y las validaciones.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/pedidos.repository');
const { validarPedido, construirPedido, ESTADOS_VALIDOS } = require('../models/pedido');
const HttpError = require('../utils/http-error');
const bodegasclient = require('../clients/bodegas.client');

async function componer(pedidos, token) {
  const ids = [...new Set(pedidos.map((e) => e.bodega_id))];
  const bodegas = await bodegasclient.bodegasPorIds(ids, token);

  if (!bodegas) {
    // degradación controlada si ms-bodegas está caído
    return pedidos.map((e) => ({ ...e, bodega_id: null, aviso: 'ms-bodegas no disponible' }));
  }
  return pedidos.map((e) => ({ ...e, bodega_id: bodegas.get(e.bodega_id) || null }));
}

// GET /pedidos con filtros opcionales ?estado= y ?ids=
async function listar(filtros, token) {
  if (filtros.estado !== undefined && !ESTADOS_VALIDOS.includes(filtros.estado)) {
    throw new HttpError(400, `El filtro estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  return componer(await repo.findAll(filtros), token);
}

async function obtener(id, token) {
  const pedido = await repo.findById(id);
  if (!pedido) throw new HttpError(404, `No existe el pedido con id ${id}`);
  const [pedidoCompuesto] = await componer([pedido], token);
  return pedidoCompuesto;
}

async function crear(datos, token) {
  const errores = validarPedido(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  if (!(await bodegasclient.existeBodega(datos.bodega_id, token))) {
    const bodega = await bodegasclient.bodegasPorIds([datos.bodega_id], token).then((bodegas) => bodegas.get(datos.bodega_id));
    throw new HttpError(400, `No existe la bodega con id ${datos.bodega_id}`);
  }
  if (!bodega.activa) {
    throw new HttpError(409, `La bodega con id ${datos.bodega_id} no está activa`);
  }

  const pedido = construirPedido(datos);

  // Regla de negocio: el número de pedido es único.
  if (await repo.findByNumero(pedido.numero)) {
    throw new HttpError(409, `Ya existe un pedido con el número ${pedido.numero}`);
  }

  pedidonuevo = await repo.create(pedido);

  const [pedidoCompuesto] = await componer([pedidonuevo], token);

  return pedidoCompuesto;
}

async function actualizar(id, datos, token) {
  const errores = validarPedido(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  // Primero se comprueba que exista (404) y después la unicidad (409).
  if (!(await repo.findById(id))) throw new HttpError(404, `No existe el pedido con id ${id}`);
  // Segundo se comprueba que la bodega exista (400).
  if (!(await bodegasclient.existeBodega(datos.bodega_id, token))) {
    const bodega = await bodegasclient.bodegasPorIds([datos.bodega_id], token).then((bodegas) => bodegas.get(datos.bodega_id));
    throw new HttpError(400, `No existe la bodega con id ${datos.bodega_id}`);
  }
  // Tercero se comprueba que la bodega esté activa (409).
  if (!bodega.activa) {
    throw new HttpError(409, `La bodega con id ${datos.bodega_id} no está activa`);
  }


  const pedido = construirPedido(datos);

  // Regla de negocio: el número no puede estar en uso por OTRO pedido.
  const otro = await repo.findByNumero(pedido.numero);
  if (otro && otro.id !== id) {
    throw new HttpError(409, `Ya existe un pedido con el número ${pedido.numero}`);
  }

  actualizado = await repo.update(id, pedido);


  const [pedidoCompuesto] = await componer([actualizado], token);
  return pedidoCompuesto;
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) throw new HttpError(404, `No existe el pedido con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
