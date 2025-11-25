const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.get('/', pagoController.obtenerTodos);
router.get('/:id', pagoController.obtenerPorId);
router.post('/', pagoController.crear);
router.put('/:id', pagoController.actualizar);
router.delete('/:id', pagoController.eliminar);
router.get('/reserva/:reservaId', pagoController.obtenerPorReserva);

module.exports = router;