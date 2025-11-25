const Cliente = require('../models/Cliente');
const Reserva = require('../models/Reserva');

const clienteController = {
    // Obtener todos los clientes
    async obtenerTodos(req, res) {
        try {
            const clientes = await Cliente.findAll({
                order: [['cliente_id', 'ASC']]
            });
            res.status(200).json({
                mensaje: 'Clientes obtenidos exitosamente',
                cantidad: clientes.length,
                datos: clientes
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener los clientes',
                error: error.message
            });
        }
    },

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }
            res.status(200).json({
                mensaje: 'Cliente obtenido exitosamente',
                datos: cliente
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener el cliente',
                error: error.message
            });
        }
    },

    async crear(req, res) {
        try {
            const { nombre, telefono } = req.body;
            const nuevoCliente = await Cliente.create({
                nombre,
                telefono
            });
            res.status(201).json({
                mensaje: 'Cliente creado exitosamente',
                datos: nuevoCliente
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    mensaje: 'Error de validación',
                    errores: error.errors.map(e => e.message)
                });
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    mensaje: 'Numero ya registrado',
                    errores: error.errors.map(e => e.message)
                });
            }
            res.status(500).json({
                mensaje: 'Error al crear el cliente',
                error: error.message
            });
        }
    },

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, telefono } = req.body;
            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }
            await cliente.update({ nombre, telefono });
            res.status(200).json({
                mensaje: 'Cliente actualizado exitosamente',
                datos: cliente
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    mensaje: 'Error de validación',
                    errores: error.errors.map(e => e.message)
                });
            }
            res.status(500).json({
                mensaje: 'Error al actualizar el cliente',
                error: error.message
            });
        }
    },

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findByPk(id);
            
            if (!cliente) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }

            const reservasAsociadas = await Reserva.findAll({
                where: { cliente_id: id }
            });

            if (reservasAsociadas.length > 0) {
                return res.status(400).json({
                    mensaje: 'No se puede eliminar el cliente',
                    error: 'El cliente tiene reservas asociadas. Elimine las reservas primero antes de eliminar el cliente.'
                });
            }

            await cliente.destroy();
            res.status(200).json({
                mensaje: 'Cliente eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al eliminar el cliente',
                error: error.message
            });
        }
    }
};

module.exports = clienteController;