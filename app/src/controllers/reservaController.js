const { Reserva, Cliente, Vehiculo, Pago } = require('../models');

const reservaController = {
    // GET /api/reservas
    obtenerTodos: async (req, res) => {
        try {
            const reservas = await Reserva.findAll({
                include: [
                    { 
                        model: Cliente, 
                        as: 'cliente',
                        attributes: ['cliente_id', 'nombre', 'telefono'] 
                    },
                    { 
                        model: Vehiculo, 
                        as: 'vehiculo',
                        attributes: ['vehiculo_id', 'patente', 'marca', 'modelo'] 
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            
            res.status(200).json({
                mensaje: 'Reservas obtenidas exitosamente',
                cantidad: reservas.length,
                datos: reservas
            });
            
        } catch (error) {
            res.status(500).json({ 
                mensaje: 'Error al obtener reservas',
                error: error.message 
            });
        }
    },

    // GET /api/reservas/:id
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            
            const reserva = await Reserva.findByPk(id, {
                include: [
                    { 
                        model: Cliente, 
                        as: 'cliente',
                        attributes: ['cliente_id', 'nombre', 'telefono']
                    },
                    { 
                        model: Vehiculo, 
                        as: 'vehiculo',
                        attributes: ['vehiculo_id', 'patente', 'marca', 'modelo', 'estado'] 
                    }
                ]
            });
            
            if (!reserva) {
                return res.status(404).json({
                    mensaje: 'Reserva no encontrada'
                });
            }
            
            res.status(200).json({
                mensaje: 'Reserva encontrada exitosamente',
                datos: reserva
            });
            
        } catch (error) {
            res.status(500).json({ 
                mensaje: 'Error al obtener la reserva',
                error: error.message 
            });
        }
    },

    // POST /api/reservas
    crear: async (req, res) => {
        try {
            const { fecha_inicio, fecha_fin, cliente_id, vehiculo_id, estado } = req.body;
            
            // Verificar que cliente existe
            const cliente = await Cliente.findByPk(cliente_id);
            if (!cliente) {
                return res.status(400).json({
                    mensaje: 'Cliente no encontrado'
                });
            }
            
            // Verificar que vehículo existe y está disponible
            const vehiculo = await Vehiculo.findByPk(vehiculo_id);
            if (!vehiculo) {
                return res.status(400).json({
                    mensaje: 'Vehículo no encontrado'
                });
            }
            
            if (vehiculo.estado !== 'Disponible') {
                return res.status(400).json({
                    mensaje: 'Vehículo no disponible',
                    estado_actual: vehiculo.estado
                });
            }
            
            // Crear la reserva
            const nuevaReserva = await Reserva.create({
                fecha_inicio,
                fecha_fin,
                cliente_id,
                vehiculo_id,
                estado: estado || 'Pendiente'
            });
            
            // Actualizar estado del vehículo
            await vehiculo.update({ estado: 'En uso' });
            
            // Obtener la reserva completa con relaciones
            const reservaCompleta = await Reserva.findByPk(nuevaReserva.reserva_id, {
                include: [
                    { 
                        model: Cliente, 
                        as: 'cliente',
                        attributes: ['cliente_id', 'nombre', 'telefono']
                    },
                    { 
                        model: Vehiculo, 
                        as: 'vehiculo',
                        attributes: ['vehiculo_id', 'patente', 'marca', 'modelo'] 
                    }
                ]
            });
            
            res.status(201).json({
                mensaje: 'Reserva creada exitosamente',
                datos: reservaCompleta
            });
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    mensaje: 'Datos de reserva inválidos',
                    errores: error.errors.map(e => e.message)
                });
            }
            
            res.status(500).json({ 
                mensaje: 'Error al crear reserva',
                error: error.message 
            });
        }
    },

    // PUT /api/reservas/:id
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            const reserva = await Reserva.findByPk(id, {
                include: [
                    { model: Vehiculo, as: 'vehiculo' }
                ]
            });
            
            if (!reserva) {
                return res.status(404).json({
                    mensaje: 'Reserva no encontrada'
                });
            }
            
            // Actualizar solo el estado
            await reserva.update({ estado });
            
            // Si se finaliza la reserva, liberar el vehículo
            if (estado === 'Finalizada' && reserva.vehiculo) {
                await reserva.vehiculo.update({ estado: 'Disponible' });
            }
            
            res.status(200).json({
                mensaje: 'Reserva actualizada exitosamente',
                datos: reserva
            });
            
        } catch (error) {
            res.status(500).json({ 
                mensaje: 'Error al actualizar reserva',
                error: error.message 
            });
        }
    },

    // DELETE /api/reservas/:id
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            const reserva = await Reserva.findByPk(id);
            
            if (!reserva) {
                return res.status(404).json({
                    mensaje: 'Reserva no encontrada'
                });
            }
            
            // Verificar si tiene pagos asociados
            const pagosAsociados = await Pago.count({
                where: { reserva_id: id }
            });
            
            if (pagosAsociados > 0) {
                return res.status(400).json({
                    mensaje: 'No se puede eliminar la reserva porque tiene pagos asociados',
                    sugerencia: 'Elimina primero los pagos asociados'
                });
            }
            
            // Obtener el vehículo para liberarlo
            const vehiculo = await Vehiculo.findByPk(reserva.vehiculo_id);
            if (vehiculo) {
                await vehiculo.update({ estado: 'Disponible' });
            }
            
            await reserva.destroy();
            
            res.status(200).json({
                mensaje: 'Reserva eliminada exitosamente',
                datos: { reserva_id: id }
            });
            
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    mensaje: 'No se puede eliminar la reserva porque tiene registros asociados',
                    error: 'Restricción de clave foránea'
                });
            }
            
            res.status(500).json({
                mensaje: 'Error al eliminar la reserva',
                error: error.message
            });
        }
    },

    // GET /api/reservas/cliente/:clienteId
    obtenerPorCliente: async (req, res) => {
        try {
            const { clienteId } = req.params;
            
            const reservas = await Reserva.findAll({
                where: { cliente_id: clienteId },
                include: [
                    { 
                        model: Vehiculo, 
                        as: 'vehiculo',
                        attributes: ['vehiculo_id', 'patente', 'marca', 'modelo'] 
                    }
                ],
                order: [['fecha_inicio', 'DESC']]
            });
            
            res.status(200).json({
                mensaje: `Reservas del cliente ${clienteId} obtenidas exitosamente`,
                cantidad: reservas.length,
                datos: reservas
            });
            
        } catch (error) {
            res.status(500).json({ 
                mensaje: 'Error al obtener reservas del cliente',
                error: error.message 
            });
        }
    },

    // GET /api/reservas/vehiculo/:vehiculoId
    obtenerPorVehiculo: async (req, res) => {
        try {
            const { vehiculoId } = req.params;
            
            const reservas = await Reserva.findAll({
                where: { vehiculo_id: vehiculoId },
                include: [
                    { 
                        model: Cliente, 
                        as: 'cliente',
                        attributes: ['cliente_id', 'nombre', 'telefono'] 
                    }
                ],
                order: [['fecha_inicio', 'DESC']]
            });
            
            res.status(200).json({
                mensaje: `Reservas del vehículo ${vehiculoId} obtenidas exitosamente`,
                cantidad: reservas.length,
                datos: reservas
            });
            
        } catch (error) {
            res.status(500).json({ 
                mensaje: 'Error al obtener reservas del vehículo',
                error: error.message 
            });
        }
    }
};

module.exports = reservaController;