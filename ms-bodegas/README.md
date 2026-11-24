# ms-bodegas · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de pedidos, que guarda el atributo `bodega_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE bodegas_db;
CREATE USER 'bodegas_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON bodegas_db.* TO 'bodegas_user'@'localhost';
```

2. `mysql -u bodegas_user -p bodegas_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "nombre_bodega": "Bodega Acopi", "ciudad": "Yumbo", "activa": true}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| nombre_bodega | texto |
| ciudad | texto |
| activa | booleano |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /bodegas | 200 arreglo | 401 |
| Consultar por lotes | GET | /bodegas?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /bodegas/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | nombre_bodega | ciudad | activa |
|---|---|---|---|
| 1 | Bodega Acopi | Yumbo | true |
| 2 | Bodega Sur | Cali | true |
| 3 | Bodega Palmira | Palmira | false |
| 4 | Bodega Puerto | Buenaventura | true |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `bodegas.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-pedidos/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-pedidos y ms-bodegas. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/pedidos` y `/api/bodegas` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-pedidos | `GET /bodegas/:id` (validar) · `GET /bodegas?ids=…` (componer) |
