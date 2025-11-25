//src/models/Cliente.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Cliente
const Cliente = sequelize.define('Cliente', {
    cliente_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre no puede estar vacío' },
        },
        len: {
            args: [2, 100],
            msg: 'El nombre debe tener entre 2 y 100 caracteres'
        }
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: { msg: 'El teléfono debe contener solo números' },
        }
    }
},
// Configuraciones del modelo
{
    tableName: 'Clientes',
    timestamps: true, 
    charset: 'utf8mb4', // Soporte para caracteres especiales
    collate: 'utf8mb4_general_ci' // Collation para utf8mb4
});

// Exportar el modelo
module.exports = Cliente;