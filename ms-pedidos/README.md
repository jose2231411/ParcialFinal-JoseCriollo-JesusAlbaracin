# ms-pedidos · Evaluación Módulo 3

Redes y Servicios Multimedia · UAO. Pareja 1 (jornada diurna):
Jose Andres Criollo Echeverri y Jesús David Albarracín Ortega.

Microservicio de pedidos con arquitectura en capas
(`routes → controller → service → repository`, más `models/pedido.js` y `utils/http-error.js`),
MySQL y seguridad con el `auth.js` de ms-usuarios.

## Cómo ejecutarlo (en el PC)

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo en el puerto 3001.

1. Crear la base de datos y su usuario (como root):

   ```sql
   CREATE DATABASE pedidos_db;
   CREATE USER 'pedidos_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
   GRANT ALL PRIVILEGES ON pedidos_db.* TO 'pedidos_user'@'localhost';
   ```

2. Crear la tabla y los registros iniciales con `db/schema.sql` (`SOURCE db/schema.sql;`).
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **igual** al de ms-usuarios.
5. `npm run dev` → `ms-pedidos escuchando en http://127.0.0.1:3011`

Cada petición queda registrada en la terminal:

```
[2026-11-22T18:30:01.123Z] GET /pedidos?estado=pendiente -> 200 (8 ms)
```

## Entidad Pedido

| Campo | Tipo | Regla |
|---|---|---|
| id | entero | Lo asigna la base de datos |
| numero | texto | Obligatorio y **único** (409 si se repite) |
| cliente | texto | Obligatorio |
| cantidad | entero | Obligatorio, mayor que 0 |
| fecha | fecha `AAAA-MM-DD` | Obligatoria y debe existir (2026-02-30 → 400) |
| estado | texto | `pendiente`, `enviado` o `entregado` |

Ejemplo de cuerpo para POST y PUT:

```json
{ "numero": "PED-010", "cliente": "Cliente D", "cantidad": 4, "fecha": "2026-11-20", "estado": "pendiente" }
```

## Seguridad

Todas las rutas de `/pedidos` exigen la cabecera `Authorization: Bearer <token>`,
con el token que entrega `POST /usuarios/login` de ms-usuarios.

- Sin token, o con un token inválido o vencido → **401**
- GET → cualquier rol
- POST, PUT y DELETE → solo `administrador` (otro rol → **403**)

## Contrato

| Método | URI | Quién | Respuesta exitosa | Errores |
|---|---|---|---|---|
| GET | /health | Público | 200 `{ servicio, estado }` | — |
| GET | /pedidos | Cualquier rol | 200 arreglo de pedidos | 400 filtro inválido · 401 |
| GET | /pedidos?estado=pendiente | Cualquier rol | 200 arreglo filtrado por estado | 400 estado inválido · 401 |
| GET | /pedidos?ids=1,3 | Cualquier rol | 200 arreglo con esos pedidos | 400 ids inválidos · 401 |
| GET | /pedidos/:id | Cualquier rol | 200 pedido | 400 id inválido · 401 · 404 |
| POST | /pedidos | administrador | 201 pedido creado + cabecera `Location` | 400 · 401 · 403 · 409 numero repetido |
| PUT | /pedidos/:id | administrador | 200 pedido actualizado | 400 · 401 · 403 · 404 · 409 numero repetido |
| DELETE | /pedidos/:id | administrador | 204 sin cuerpo | 400 id inválido · 401 · 403 · 404 |

Los filtros `?estado=` y `?ids=` se pueden combinar.

Formato de los errores:

```json
{ "error": "Datos inválidos", "detalles": ["cantidad es obligatoria y debe ser un entero mayor que 0"] }
```

## Pruebas

`docs/ms-pedidos.postman_collection.json`: importarla en Postman y ejecutarla con el Runner,
**en orden**. Primero hace login como administrador (`admin@empresa.com` / `Admin2026*`) y guarda
el token, que el resto de peticiones usan automáticamente. Hay una prueba por cada código:
200, 201, 204, 400, 401, 404 y 409. El pedido que crea la prueba de 201 se borra al final, así que
la colección se puede ejecutar varias veces.

Variables de la colección:

- `usuariosUrl` = `http://localhost:3001`
- `pedidosUrl` = `http://localhost:3011`

Para probar a través del host virtual del examen, se cambian las dos variables por la URL del gateway.

## Despliegue (servidor2)

`deploy/ms-pedidos.service` es la plantilla del servicio de systemd (usuario `nodeapps`).
En servidor2, `.env` debe tener `DB_HOST` con la IP de servidor1 y permisos 640.
