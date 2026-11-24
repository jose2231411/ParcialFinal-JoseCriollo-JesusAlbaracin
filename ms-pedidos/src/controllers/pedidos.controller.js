// =====================================================================
// CAPA DE PRESENTACIÓN (controlador)
// Traduce HTTP <-> servicio: lee la petición (params, body),
// llama al servicio y arma la respuesta (código de estado + JSON).
// =====================================================================
const service = require('../services/pedidos.service');
const HttpError = require('../utils/http-error');

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
}

// GET /pedidos
async function listar(req, res) {
  const filtros = { estado: req.query.estado };
  if (req.query.ids) {
    filtros.ids = String(req.query.ids).split(',').map(Number);
    if (filtros.ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      throw new HttpError(400, 'Los ids deben ser enteros positivos separados por comas');
    }
  }
  const pedidos = await service.listar(filtros, req.headers.authorization);
  res.status(200).json(pedidos);
}

// GET /pedidos/:id
async function obtener(req, res) {
  const pedido = await service.obtener(leerId(req), req.headers.authorization);
  res.status(200).json(pedido);
}

// POST /pedidos
async function crear(req, res) {
  const nuevo = await service.crear(req.body, req.headers.authorization);
  res.status(201).location(`${req.baseUrl}/${nuevo.id}`).json(nuevo);
}

// PUT /pedidos/:id
async function actualizar(req, res) {
  const actualizado = await service.actualizar(leerId(req), req.body, req.headers.authorization);
  res.status(200).json(actualizado);
}

// DELETE /pedidos/:id
async function eliminar(req, res) {
  await service.eliminar(leerId(req));
  res.status(204).send();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
