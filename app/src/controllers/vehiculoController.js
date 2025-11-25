// src/controllers/vehiculoController.js
const Vehiculo = require('../models/Vehiculo');

const vehiculoController = {

    // GET /api/vehiculos
    obtenerTodos: async (req, res) => {
        try {
            const vehiculos = await Vehiculo.findAll({
                order: [['marca', 'ASC'], ['modelo', 'ASC']]
            });
            
            res.status(200).json({
                mensaje: 'Vehículos obtenidos exitosamente',
                cantidad: vehiculos.length,
                datos: vehiculos
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener vehículos',
                error: error.message
            });
        }
    },

    // GET /api/vehiculos/:id
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const vehiculo = await Vehiculo.findByPk(id);
            
            if (!vehiculo) {
                return res.status(404).json({
                    mensaje: `Vehículo con ID ${id} no encontrado`
                });
            }
            
            res.status(200).json({
                mensaje: 'Vehículo encontrado exitosamente',
                datos: vehiculo
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener vehículo',
                error: error.message
            });
        }
    },

    // GET /api/vehiculos/estado/:estado
    obtenerPorEstado: async (req, res) => {
        try {
            const { estado } = req.params;
            const vehiculos = await Vehiculo.findAll({
                where: { estado },
                order: [['marca', 'ASC']]
            });
            
            res.status(200).json({
                mensaje: `Vehículos con estado ${estado} obtenidos exitosamente`,
                cantidad: vehiculos.length,
                datos: vehiculos
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener vehículos por estado',
                error: error.message
            });
        }
    },

    // POST /api/vehiculos
    crear: async (req, res) => {
        try {
            const { patente, marca, modelo, año, km_actual, estado } = req.body;
            
            const nuevoVehiculo = await Vehiculo.create({
                patente,
                marca,
                modelo,
                año,
                km_actual,
                estado: estado || 'Disponible'
            });
            
            res.status(201).json({
                mensaje: 'Vehículo creado exitosamente',
                datos: nuevoVehiculo
            });
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    mensaje: 'Datos inválidos',
                    errores: error.errors.map(e => e.message)
                });
            }
            
            res.status(500).json({
                mensaje: 'Error al crear vehículo',
                error: error.message
            });
        }
    },

    // PUT /api/vehiculos/:id
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { patente, marca, modelo, año, km_actual, estado } = req.body;
            
            const vehiculo = await Vehiculo.findByPk(id);
            if (!vehiculo) {
                return res.status(404).json({
                    mensaje: `Vehículo con ID ${id} no encontrado`
                });
            }
            
            await vehiculo.update({ patente, marca, modelo, año, km_actual, estado });
            
            res.status(200).json({
                mensaje: 'Vehículo actualizado exitosamente',
                datos: vehiculo
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al actualizar vehículo',
                error: error.message
            });
        }
    },

    // DELETE /api/vehiculos/:id
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            const vehiculo = await Vehiculo.findByPk(id);
            if (!vehiculo) {
                return res.status(404).json({
                    mensaje: `Vehículo con ID ${id} no encontrado`
                });
            }
            
            await vehiculo.destroy();
            
            res.status(200).json({
                mensaje: 'Vehículo eliminado exitosamente'
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al eliminar vehículo',
                error: error.message
            });
        }
    }
};

module.exports = vehiculoController;