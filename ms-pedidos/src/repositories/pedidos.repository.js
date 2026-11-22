// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio) — versión MySQL
// Única capa que sabe dónde y cómo se guardan los datos.
// =====================================================================
const pool = require('../db');

async function findAll(filtros = {}) {
  let sql = 'SELECT * FROM pedidos';
  const condiciones = [];
  const valores = [];
  if (filtros.estado) {
    condiciones.push('estado = ?');
    valores.push(filtros.estado);
  }
  if (filtros.ids) {                       // ?ids=1,2,3 → WHERE id IN (1, 2, 3)
    condiciones.push('id IN (?)');
    valores.push(filtros.ids);
  }
  if (condiciones.length > 0) sql += ' WHERE ' + condiciones.join(' AND ');
  const [filas] = await pool.query(sql + ' ORDER BY id', valores);
  return filas;
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);
  return filas.length > 0 ? filas[0] : null;
}

async function findByNumero(numero) {
  const [filas] = await pool.query('SELECT * FROM pedidos WHERE numero = ?', [numero]);
  return filas.length > 0 ? filas[0] : null;
}

async function create(pedido) {
  const [resultado] = await pool.query(
    'INSERT INTO pedidos (numero, cliente, cantidad, fecha, estado) VALUES (?, ?, ?, ?, ?)',
    [pedido.numero, pedido.cliente, pedido.cantidad, pedido.fecha, pedido.estado]);
  return findById(resultado.insertId);
}

async function update(id, pedido) {
  const [resultado] = await pool.query(
    'UPDATE pedidos SET numero = ?, cliente = ?, cantidad = ?, fecha = ?, estado = ? WHERE id = ?',
    [pedido.numero, pedido.cliente, pedido.cantidad, pedido.fecha, pedido.estado, id]);
  if (resultado.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.query('DELETE FROM pedidos WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { findAll, findById, findByNumero, create, update, remove };
