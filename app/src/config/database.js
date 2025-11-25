// src/config/database.js
const { Sequelize } = require('sequelize');

// Configuración de la conexión
const sequelize = new Sequelize({
dialect: 'mysql',
host: 'localhost',
port: 3306,
username: 'root', 
password: 'Seba1107!',
database: 'autogo', 
logging: console.log, 
timezone: '-04:00', 
pool: {
max: 5,
min: 0, 
acquire: 30000, 
idle: 10000 
}
});
module.exports = sequelize;