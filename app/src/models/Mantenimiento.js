//src/models/Mantenimiento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Mantenimiento = sequelize.define('Mantenimiento', {
    mantenimiento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },    
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: { msg: 'La fecha debe ser una fecha válida' },
        }
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El tipo de mantenimiento no puede estar vacío' },
        }
    },
    costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: 'El costo debe ser un número decimal' },
        }
    },
    vehiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Vehiculos', // Nombre de la tabla referenciada
            key: 'vehiculo_id' // Clave primaria en la tabla referenciada
        }
    }
}, {
    tableName: 'Mantenimientos', // Nombre de la tabla en la base de datos
    timestamps: true // Añade campos createdAt y updatedAt
});

module.exports = Mantenimiento;