const { Mantenimiento, Vehiculo } = require('../models');

// GET /api/mantenimientos
exports.obtenerTodos = async (req, res) => {
    try {
        const mantenimientos = await Mantenimiento.findAll({
            include: [
                { model: Vehiculo, as: 'vehiculo' }
            ],
            order: [['fecha', 'DESC']]
        });
        
        res.status(200).json({
            mensaje: 'Mantenimientos obtenidos exitosamente',
            cantidad: mantenimientos.length,
            datos: mantenimientos
        });
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// GET /api/mantenimientos/:id
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const mantenimiento = await Mantenimiento.findByPk(id, {
            include: [
                { model: Vehiculo, as: 'vehiculo' }
            ]
        });
        
        if (!mantenimiento) {
            return res.status(404).json({
                mensaje: 'Mantenimiento no encontrado'
            });
        }
        
        res.status(200).json({
            mensaje: 'Mantenimiento encontrado exitosamente',
            datos: mantenimiento
        });
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// POST /api/mantenimientos
exports.crear = async (req, res) => {
    try {
        const { fecha, tipo, costo, vehiculo_id } = req.body;
        
        const vehiculo = await Vehiculo.findByPk(vehiculo_id);
        if (!vehiculo) {
            return res.status(400).json({
                mensaje: 'Vehículo no encontrado'
            });
        }
        
        const nuevoMantenimiento = await Mantenimiento.create({
            fecha,
            tipo,
            costo,
            vehiculo_id
        });
        
        await vehiculo.update({ estado: 'Mantenimiento' });
        
        const mantenimientoCompleto = await Mantenimiento.findByPk(nuevoMantenimiento.mantenimiento_id, {
            include: [
                { model: Vehiculo, as: 'vehiculo' }
            ]
        });
        
        res.status(201).json({
            mensaje: 'Mantenimiento creado exitosamente',
            datos: mantenimientoCompleto
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
};

// PUT /api/mantenimientos/:id/completar
exports.completar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const mantenimiento = await Mantenimiento.findByPk(id, {
            include: [
                { model: Vehiculo, as: 'vehiculo' }
            ]
        });
        
        if (!mantenimiento) {
            return res.status(404).json({
                mensaje: 'Mantenimiento no encontrado'
            });
        }
        
        await mantenimiento.vehiculo.update({ estado: 'Disponible' });
        
        res.status(200).json({
            mensaje: 'Mantenimiento completado exitosamente',
            datos: mantenimiento
        });
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// GET /api/mantenimientos/vehiculo/:vehiculoId
exports.obtenerPorVehiculo = async (req, res) => {
    try {
        const { vehiculoId } = req.params;
        
        const mantenimientos = await Mantenimiento.findAll({
            where: { vehiculo_id: vehiculoId },
            include: [
                { model: Vehiculo, as: 'vehiculo' }
            ],
            order: [['fecha', 'DESC']]
        });
        
        res.status(200).json({
            mensaje: 'Mantenimientos del vehículo obtenidos exitosamente',
            cantidad: mantenimientos.length,
            datos: mantenimientos
        });
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};