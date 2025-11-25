// src/controllers/pagoController.js
const { Pago, Reserva } = require('../models');

const pagoController = {

    // GET /api/pagos
    obtenerTodos: async (req, res) => {
        try {
            const pagos = await Pago.findAll({
                include: [
                    { model: Reserva, as: 'reserva' }
                ],
                order: [['fecha', 'DESC']]
            });
            
            res.status(200).json({
                mensaje: 'Pagos obtenidos exitosamente',
                cantidad: pagos.length,
                datos: pagos
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // GET /api/pagos/:id
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const pago = await Pago.findByPk(id, {
                include: [
                    { model: Reserva, as: 'reserva' }
                ]
            });
            
            if (!pago) {
                return res.status(404).json({
                    mensaje: 'Pago no encontrado'
                });
            }
            
            res.status(200).json({
                mensaje: 'Pago encontrado exitosamente',
                datos: pago
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // GET /api/pagos/reserva/:reservaId
    obtenerPorReserva: async (req, res) => {
        try {
            const { reservaId } = req.params;
            const pagos = await Pago.findAll({
                where: { reserva_id: reservaId },
                order: [['fecha', 'DESC']]
            });
            
            res.status(200).json({
                mensaje: 'Pagos obtenidos exitosamente',
                cantidad: pagos.length,
                datos: pagos
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // POST /api/pagos
    crear: async (req, res) => {
        try {
            const { fecha, monto, metodo, reserva_id } = req.body;
            
            const reserva = await Reserva.findByPk(reserva_id);
            if (!reserva) {
                return res.status(400).json({
                    mensaje: 'Reserva no encontrada'
                });
            }
            
            const nuevoPago = await Pago.create({
                fecha,
                monto,
                metodo,
                reserva_id
            });
            
            const pagoCompleto = await Pago.findByPk(nuevoPago.pago_id, {
                include: [
                    { model: Reserva, as: 'reserva' }
                ]
            });
            
            res.status(201).json({
                mensaje: 'Pago creado exitosamente',
                datos: pagoCompleto
            });
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    mensaje: 'Datos inválidos',
                    errores: error.errors.map(e => e.message)
                });
            }
            
            res.status(500).json({
                mensaje: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // PUT /api/pagos/:id
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { fecha, monto, metodo, reserva_id } = req.body;
            
            const pago = await Pago.findByPk(id);
            if (!pago) {
                return res.status(404).json({
                    mensaje: 'Pago no encontrado'
                });
            }
            
            await pago.update({ fecha, monto, metodo, reserva_id });
            
            res.status(200).json({
                mensaje: 'Pago actualizado exitosamente',
                datos: pago
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // DELETE /api/pagos/:id
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            const pago = await Pago.findByPk(id);
            if (!pago) {
                return res.status(404).json({
                    mensaje: 'Pago no encontrado'
                });
            }
            
            await pago.destroy();
            
            res.status(200).json({
                mensaje: 'Pago eliminado exitosamente'
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = pagoController;