# 🚗 AUTOGO — API de Gestión de Arriendo de Vehículos

API REST desarrollada con **Node.js**, **Express** y **MySQL** (via Sequelize) para gestionar el arriendo de vehículos, incluyendo clientes, reservas, pagos y mantenimientos.

---

## 🛠️ Tecnologías

- **Node.js** con Express 5
- **MySQL** como base de datos relacional
- **Sequelize** como ORM
- **CORS** habilitado
- **dotenv** para variables de entorno
- **nodemon** para desarrollo

---

## 📁 Estructura del proyecto

```
app/
└── src/
    ├── app.js                  # Punto de entrada
    ├── config/
    │   └── database.js         # Conexión a MySQL con Sequelize
    ├── models/
    │   ├── Cliente.js
    │   ├── Vehiculo.js
    │   ├── Reserva.js
    │   ├── Mantenimiento.js
    │   ├── Pago.js
    │   └── index.js            # Relaciones entre modelos
    ├── controllers/
    │   ├── clienteController.js
    │   ├── vehiculoController.js
    │   ├── reservaController.js
    │   ├── mantenimientoController.js
    │   └── pagoController.js
    └── routes/
        ├── clienteRoutes.js
        ├── vehiculoRoutes.js
        ├── reservaRoutes.js
        ├── mantenimientoRoutes.js
        └── pagoRoutes.js
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/API-AUTOGO-UNIVERSIDAD.git
cd API-AUTOGO-UNIVERSIDAD/app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos

Edita el archivo `src/config/database.js` con tus credenciales de MySQL:

```js
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'autogo',
});
```

> ⚠️ Se recomienda usar un archivo `.env` para no exponer credenciales en el código.

### 4. Crear la base de datos

```sql
CREATE DATABASE autogo;
```

Sequelize creará las tablas automáticamente al iniciar la aplicación (`sync({ alter: true })`).

### 5. Iniciar el servidor

```bash
# Producción
npm start

# Desarrollo (con recarga automática)
npm run dev
```

El servidor se levantará en `http://localhost:3000`.

---

## 🔗 Endpoints disponibles

### Base URL: `http://localhost:3000/api`

---

### 👤 Clientes — `/api/clientes`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/clientes` | Obtener todos los clientes |
| GET | `/api/clientes/:id` | Obtener cliente por ID |
| POST | `/api/clientes` | Crear nuevo cliente |
| PUT | `/api/clientes/:id` | Actualizar cliente |
| DELETE | `/api/clientes/:id` | Eliminar cliente |

**Campos requeridos al crear:**
```json
{
  "nombre": "Juan Pérez",
  "telefono": "56912345678"
}
```

---

### 🚙 Vehículos — `/api/vehiculos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/vehiculos` | Obtener todos los vehículos |
| GET | `/api/vehiculos/:id` | Obtener vehículo por ID |
| GET | `/api/vehiculos/estado/:estado` | Filtrar por estado |
| POST | `/api/vehiculos` | Crear nuevo vehículo |
| PUT | `/api/vehiculos/:id` | Actualizar vehículo |
| DELETE | `/api/vehiculos/:id` | Eliminar vehículo |

**Estados posibles:** `Disponible` | `En uso` | `Mantenimiento` | `Reparación`

**Campos requeridos al crear:**
```json
{
  "patente": "ABCD12",
  "marca": "Toyota",
  "modelo": "Corolla",
  "año": 2022,
  "km_actual": "15000",
  "estado": "Disponible"
}
```

---

### 📅 Reservas — `/api/reservas`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reservas` | Obtener todas las reservas |
| GET | `/api/reservas/:id` | Obtener reserva por ID |
| GET | `/api/reservas/cliente/:clienteId` | Reservas de un cliente |
| GET | `/api/reservas/vehiculo/:vehiculoId` | Reservas de un vehículo |
| POST | `/api/reservas` | Crear nueva reserva |
| PUT | `/api/reservas/:id` | Actualizar reserva |
| DELETE | `/api/reservas/:id` | Eliminar reserva |

**Campos requeridos al crear:**
```json
{
  "fecha_inicio": "2025-12-01",
  "fecha_fin": "2025-12-10",
  "cliente_id": 1,
  "vehiculo_id": 3
}
```

---

### 💳 Pagos — `/api/pagos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pagos` | Obtener todos los pagos |
| GET | `/api/pagos/:id` | Obtener pago por ID |
| GET | `/api/pagos/reserva/:reservaId` | Pagos de una reserva |
| POST | `/api/pagos` | Registrar nuevo pago |
| PUT | `/api/pagos/:id` | Actualizar pago |
| DELETE | `/api/pagos/:id` | Eliminar pago |

**Métodos de pago aceptados:** `Transferencia` | `Efectivo` | `Credito` | `Debito`

**Campos requeridos al crear:**
```json
{
  "monto": 50000.00,
  "metodo": "Transferencia",
  "reserva_id": 1
}
```

---

### 🔧 Mantenimientos — `/api/mantenimientos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/mantenimientos` | Obtener todos los mantenimientos |
| GET | `/api/mantenimientos/:id` | Obtener mantenimiento por ID |
| GET | `/api/mantenimientos/vehiculo/:vehiculoId` | Mantenimientos de un vehículo |
| POST | `/api/mantenimientos` | Registrar nuevo mantenimiento |
| PUT | `/api/mantenimientos/:id/completar` | Marcar mantenimiento como completado |

**Campos requeridos al crear:**
```json
{
  "fecha": "2025-11-20",
  "tipo": "Cambio de aceite",
  "costo": 35000.00,
  "vehiculo_id": 2
}
```

---

## 🗂️ Modelo de datos

```
Cliente ──< Reserva >── Vehiculo
               │           │
               └──< Pago   └──< Mantenimiento
```

- Un **Cliente** puede tener muchas **Reservas**
- Un **Vehículo** puede tener muchas **Reservas**
- Una **Reserva** puede tener muchos **Pagos**
- Un **Vehículo** puede tener muchos **Mantenimientos**

---

## 📌 Notas

- El servidor corre por defecto en el puerto `3000`. Se puede cambiar con la variable de entorno `PORT`.
- Las tablas se sincronizan automáticamente con `alter: true` al iniciar.
- Todos los errores devuelven JSON con un campo `mensaje` descriptivo.
- Las rutas no encontradas retornan `404` con sugerencia de verificar la URL.
