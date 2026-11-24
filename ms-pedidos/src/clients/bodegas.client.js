// =====================================================================
// CLIENTE HTTP de ms-bodegas, para el microservicio de pedidos.
// Copie este archivo en ms-pedidos/src/clients/ y COMPLÉTELO:
// la función pedir() ya está hecha; faltan las funciones que usan
// la validación, la regla de negocio y la composición.
// En el .env de ms-pedidos:  BODEGAS_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const BODEGAS_URL = process.env.BODEGAS_URL;

// Hace una petición GET a ms-bodegas reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-bodegas no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(`${BODEGAS_URL}${ruta}`, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-bodegas caído o sin responder
  }
}


async function existeBodega(id, token) {
  const respuesta = await pedir(`/bodegas/${id}`, token);
  if (!respuesta) throw new HttpError(503, 'ms-bodegas no está disponible');
  if (respuesta.status === 404) return false;
  if (!respuesta.ok) throw new HttpError(502, `ms-bodegas respondió ${respuesta.status}`);
  return true;
}

async function bodegasPorIds(ids, token) {
  if (ids.length === 0) return new Map();
  const respuesta = await pedir(`/bodegas?ids=${ids.join(',')}`, token);
  if (!respuesta) return null;
  if (!respuesta.ok) throw new HttpError(502, `ms-bodegas respondió ${respuesta.status}`);
  const bodegas = await respuesta.json();
  return new Map(bodegas.map((b) => [b.id, { id: b.id, nombre_bodega: b.nombre_bodega, ciudad: b.ciudad, activa: b.activa }]));
}

// Ejemplo de uso:
//   const respuesta = await pedir('/bodegas/3', token);
//   if (!respuesta) ...                   → ms-bodegas no respondió
//   if (respuesta.status === 404) ...     → no existe
//   const datos = await respuesta.json(); → el objeto (o el arreglo, con ?ids=)

module.exports = { pedir, existeBodega, bodegasPorIds };
