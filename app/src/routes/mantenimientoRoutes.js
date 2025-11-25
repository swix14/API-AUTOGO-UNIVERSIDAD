const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientoController');

router.get('/', mantenimientoController.obtenerTodos);
router.get('/:id', mantenimientoController.obtenerPorId);
router.post('/', mantenimientoController.crear);
router.put('/:id/completar', mantenimientoController.completar);
router.get('/vehiculo/:vehiculoId', mantenimientoController.obtenerPorVehiculo);

module.exports = router;