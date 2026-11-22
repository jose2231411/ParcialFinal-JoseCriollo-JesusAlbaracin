// =====================================================================
// Configuración de la aplicación Express.
// Aquí se registran los middlewares, las rutas y el manejo de errores.
// =====================================================================
const express = require('express');
const cors = require('cors');
const pedidosRoutes = require('./routes/pedidos.routes');

const app = express();

// Registro de peticiones: cuando la respuesta termina, imprime en la terminal
// el método, la ruta, el código de respuesta y lo que tardó.
// Va primero para que registre TODAS las peticiones, incluso las de error.
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on('finish', () => {
    const hora = new Date().toISOString();
    console.log(`[${hora}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - inicio} ms)`);
  });
  next();
});

// CORS: permite que un frontend en otro origen llame a este microservicio.
app.use(cors());

// Convierte el cuerpo JSON de la petición en un objeto (req.body)
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ servicio: 'ms-pedidos', estado: 'ok' });
});

app.use('/pedidos', pedidosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  // JSON mal formado en el cuerpo de la petición
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message, detalles: err.detalles });
});

module.exports = app;
