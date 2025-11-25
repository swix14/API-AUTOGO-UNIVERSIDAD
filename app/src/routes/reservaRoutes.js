const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.obtenerTodos);
router.get('/:id', reservaController.obtenerPorId);
router.post('/', reservaController.crear);
router.put('/:id', reservaController.actualizar);
router.get('/cliente/:clienteId', reservaController.obtenerPorCliente);
router.get('/vehiculo/:vehiculoId', reservaController.obtenerPorVehiculo);
router.delete('/:id', reservaController.eliminar);

module.exports = router;