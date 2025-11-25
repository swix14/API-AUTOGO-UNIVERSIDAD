const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
    pago_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    metodo: {
        type: DataTypes.ENUM('Transferencia', 'Efectivo', 'Credito', 'Debito'),
        allowNull: false,
    },
    reserva_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Reservas', // Nombre de la tabla referenciada
            key: 'reserva_id' // Clave primaria en la tabla referenciada
        }
    }
}, {
    tableName: 'Pagos',
    timestamps: true 
});
module.exports = Pago;