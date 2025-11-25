// src/models/index.js
const Cliente = require('./Cliente');
const Vehiculo = require('./Vehiculo');
const Reserva = require('./Reserva');
const Mantenimiento = require('./Mantenimiento');
const Pago = require('./Pago');

Cliente.hasMany(Reserva, {
    foreignKey: 'cliente_id',
    as: 'reservas'
});

Reserva.belongsTo(Cliente, {
    foreignKey: 'cliente_id',
    as: 'cliente'
});

Vehiculo.hasMany(Reserva, {
    foreignKey: 'vehiculo_id',
    as: 'reservas'
});

Reserva.belongsTo(Vehiculo, {
    foreignKey: 'vehiculo_id',
    as: 'vehiculo'
});

Vehiculo.hasMany(Mantenimiento, {
    foreignKey: 'vehiculo_id',
    as: 'mantenimientos'
});

Mantenimiento.belongsTo(Vehiculo, {
    foreignKey: 'vehiculo_id',
    as: 'vehiculo'
});

Reserva.hasMany(Pago, {
    foreignKey: 'reserva_id',
    as: 'pagos'
});

Pago.belongsTo(Reserva, {
    foreignKey: 'reserva_id',
    as: 'reserva'
});


module.exports = {
    Cliente,
    Vehiculo,
    Reserva,
    Mantenimiento,
    Pago
};