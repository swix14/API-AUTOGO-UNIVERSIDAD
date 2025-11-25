const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importar rutas
const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const mantenimientoRoutes = require('./routes/mantenimientoRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

//aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de peticiones
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: '¡Bienvenido a AUTOGO - Gestión de Alquiler de Vehículos!',
        version: '1.0.0',
        endpoints: {
            clientes: '/api/clientes',
            vehiculos: '/api/vehiculos',
            reservas: '/api/reservas',       
            mantenimientos: '/api/mantenimientos',   
            pagos: '/api/pagos'               
        }
    });
});

// Configurar las rutas API
app.use('/api/clientes', clienteRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/pagos', pagoRoutes);

// Middleware rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada',
        ruta_solicitada: req.originalUrl,
        metodo: req.method,
        sugerencia: 'Verifica la URL'
    });
});

// Middleware global para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
    });
});

//Iniciar el servidor
async function iniciarServidor() {
    try {
        console.log(' Iniciando aplicación...');
        
        // Probar la conexión
        await sequelize.authenticate();
        console.log(' Conexión establecida');
        
        // Sincronizar modelos
        await sequelize.sync({ alter: true });
        console.log(' Modelos preparados');
        
        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(' Servidor iniciado exitosamente');
            console.log(' URL: http://localhost:' + PORT);
            console.log(' API disponible en: /api');
            console.log('  Para detener: Ctrl + C');
            console.log('\n📋 Endpoints disponibles:');
            console.log('    GET/POST/PUT/DELETE /api/clientes');
            console.log('    GET/POST/PUT/DELETE /api/vehiculos');
            console.log('    GET/POST/PUT/DELETE /api/reservas');
            console.log('    GET/POST           /api/pagos');
            console.log('    GET/POST           /api/mantenimientos');
        });

    } catch (error) {
        console.error(' Error al iniciar la aplicación');
        console.error(' Verifica la conexion');
        process.exit(1);
    }
}

// Iniciar el servidor
iniciarServidor();

module.exports = app;