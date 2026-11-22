// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/pedidos.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = Router();

// Todas las rutas exigen un token válido (401 si falta o es inválido)
router.use(verificarToken);

// Lectura: cualquier rol
router.get('/', controller.listar);       // ?estado=  y  ?ids=1,2,3
router.get('/:id', controller.obtener);

// Escritura: solo administrador (403 para los demás roles)
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;
