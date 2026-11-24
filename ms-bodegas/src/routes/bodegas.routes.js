// CAPA DE PRESENTACIÓN: rutas de bodegas (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/bodegas.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /bodegas  y  GET /bodegas?ids=1,3
router.get('/:id', controller.obtener);   // GET /bodegas/:id

module.exports = router;
