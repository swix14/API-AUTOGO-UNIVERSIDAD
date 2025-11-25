// src/models/Vehiculo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
    vehiculo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    patente: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'La patente no puede estar vacía' }
        }
    },
    marca: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La marca es obligatoria' }
        }
    },
    modelo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El modelo es obligatorio' }
        }
    },
    año: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: { args: [1900], msg: 'El año debe ser válido' },
            max: { args: [new Date().getFullYear() + 1], msg: 'El año no puede ser futuro' }
        }
    },
    km_actual: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El kilometraje es obligatorio' }
        }
    },
    estado: {
        type: DataTypes.ENUM('Disponible', 'En uso', 'Mantenimiento', 'Reparación'),
        defaultValue: 'Disponible',
        allowNull: false
    }
}, {
    tableName: 'Vehiculos',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});

module.exports = Vehiculo;