// CAPA DE ACCESO A DATOS: bodegas en MySQL
const pool = require('../db');

// MySQL guarda BOOLEAN como 0/1: aquí se traduce al formato del contrato
const aObjeto = (fila) => ({ ...fila, activa: Boolean(fila.activa) });

async function findAll(ids) {
  const [filas] = ids
    ? await pool.query('SELECT * FROM bodegas WHERE id IN (?) ORDER BY id', [ids])
    : await pool.query('SELECT * FROM bodegas ORDER BY id');
  return filas.map(aObjeto);
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM bodegas WHERE id = ?', [id]);
  return filas.length ? aObjeto(filas[0]) : null;
}

module.exports = { findAll, findById };
