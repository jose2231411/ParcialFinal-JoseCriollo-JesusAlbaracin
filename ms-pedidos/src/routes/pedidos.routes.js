// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/pedidos.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth.js');

const router = Router();

router.use(verificarToken); // todas las rutas requieren token válido


router.get('/', controller.listar);      // listar todos los pedidos
router.get('/:id', controller.obtener);  // obtener un pedido por id
router.use(requiereRol('administrador'));
router.post('/', controller.crear);      // crear un pedido

router.put('/:id', controller.actualizar); // actualizar un pedido por id
router.delete('/:id', controller.eliminar); // eliminar un pedido por id


module.exports = router;