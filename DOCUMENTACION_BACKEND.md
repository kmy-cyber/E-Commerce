# 🚀 Documentación Backend - E-commerce API

## 📋 Información General

**Aplicación:** E-commerce Backend API  
**Tecnología Principal:** Node.js con Express.js  
**Base de Datos:** MySQL con Sequelize ORM  
**Arquitectura:** RESTful API con patrón MVC  
**Puerto:** 3000  

## 🛠️ Stack Tecnológico

### Core Technologies
- **Node.js** - Runtime de JavaScript
- **Express.js 4.19.2** - Framework web
- **Sequelize 6.37.7** - ORM para base de datos
- **MySQL2 3.14.2** - Driver de MySQL

### Autenticación y Seguridad
- **JSON Web Token 9.0.2** - Autenticación basada en tokens
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 16.4.5** - Gestión de variables de entorno

### Manejo de Archivos
- **Multer 2.0.2** - Middleware para subida de archivos
- **Form-data 4.0.4** - Manejo de formularios multipart

### Desarrollo
- **Nodemon 3.1.10** - Auto-restart en desarrollo
- **Axios 1.7.2** - Cliente HTTP para requests externos

## 📁 Arquitectura del Proyecto

### Estructura de Directorios

```
my-ecommerce-backend/
├── src/                          # Código fuente principal
│   ├── config/                   # Configuraciones
│   │   └── db.js                # Configuración de base de datos
│   ├── controllers/              # Controladores (lógica de negocio)
│   │   ├── authController.js    # Autenticación
│   │   ├── categoryController.js # Gestión de categorías
│   │   ├── dashboardController.js # Dashboard y estadísticas
│   │   ├── productController.js # Gestión de productos
│   │   └── reservationController.js # Reservas de stock
│   ├── database/                 # Base de datos
│   │   └── database.sqlite      # Base de datos SQLite (desarrollo)
│   ├── middleware/               # Middlewares personalizados
│   │   ├── auth.js              # Middleware de autenticación
│   │   └── upload.js            # Middleware de subida de archivos
│   ├── models/                   # Modelos de Sequelize
│   │   ├── Category.js          # Modelo de categoría
│   │   ├── Order.js             # Modelo de orden
│   │   ├── OrderItem.js         # Modelo de item de orden
│   │   ├── Product.js           # Modelo de producto
│   │   └── StockReservation.js  # Modelo de reserva de stock
│   ├── routes/                   # Definición de rutas
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── categoryRoutes.js    # Rutas de categorías
│   │   ├── dashboardRoutes.js   # Rutas del dashboard
│   │   ├── productRoutes.js     # Rutas de productos
│   │   └── reservationRoutes.js # Rutas de reservas
│   ├── scripts/                  # Scripts de utilidad
│   │   ├── check-products.js    # Verificación de productos
│   │   ├── init-db.sql          # Inicialización de BD
│   │   ├── initializeCategories.js # Inicialización de categorías
│   │   ├── migrate-image-urls.js # Migración de URLs de imágenes
│   │   └── seed-data.js         # Datos de prueba
│   ├── services/                 # Servicios de negocio
│   │   └── reservationCleanupService.js # Limpieza de reservas
│   ├── server.js                 # Servidor principal
│   └── test-routes.js           # Rutas de prueba
├── uploads/                      # Directorio de archivos subidos
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts
├── server.js                    # Punto de entrada (redirige a src/)
└── README.md                    # Documentación básica
```

## 🗄️ Modelos de Base de Datos

### Product (Producto)
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  name: STRING (Not Null),
  description: TEXT,
  price: DECIMAL(10,2) (Not Null),
  stock: INTEGER (Default: 0),
  reserved_stock: INTEGER (Default: 0),
  category_id: INTEGER (Foreign Key),
  image_url: STRING,
  created_at: DATE,
  updated_at: DATE
}
```

### Category (Categoría)
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  name: STRING (Not Null, Unique),
  description: TEXT,
  created_at: DATE,
  updated_at: DATE
}
```

### StockReservation (Reserva de Stock)
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  cart_id: STRING (Not Null),
  product_id: INTEGER (Foreign Key),
  quantity: INTEGER (Not Null),
  expires_at: DATE (Not Null),
  created_at: DATE,
  updated_at: DATE
}
```

### Order (Orden)
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  total_amount: DECIMAL(10,2),
  status: STRING (Default: 'pending'),
  created_at: DATE,
  updated_at: DATE
}
```

### OrderItem (Item de Orden)
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  order_id: INTEGER (Foreign Key),
  product_id: INTEGER (Foreign Key),
  quantity: INTEGER (Not Null),
  price: DECIMAL(10,2) (Not Null),
  created_at: DATE,
  updated_at: DATE
}
```

## 🛣️ API Endpoints

### 🔓 Endpoints Públicos

#### Productos
```
GET    /api/products              # Obtener todos los productos
GET    /api/products/:id          # Obtener producto por ID
```

#### Categorías
```
GET    /api/categories            # Obtener todas las categorías
```

#### Reservas de Stock
```
POST   /api/reservations          # Crear reserva de stock
PUT    /api/reservations/extend   # Extender reserva
DELETE /api/reservations          # Liberar reserva
```

### 🔐 Endpoints Privados (Requieren Autenticación)

#### Autenticación
```
POST   /api/auth/login            # Login de administrador
POST   /api/auth/logout           # Logout de administrador
GET    /api/auth/verify           # Verificar token
```

#### Administración de Productos
```
POST   /api/admin/products        # Crear producto
PUT    /api/admin/products/:id    # Actualizar producto
DELETE /api/admin/products/:id    # Eliminar producto
```

#### Administración de Categorías
```
POST   /api/admin/categories      # Crear categoría
PUT    /api/admin/categories/:id  # Actualizar categoría
DELETE /api/admin/categories/:id  # Eliminar categoría
```

#### Dashboard
```
GET    /api/admin/dashboard/stats # Obtener estadísticas
GET    /api/admin/dashboard/products # Productos con estadísticas
```

## 🔧 Controladores

### AuthController (`authController.js`)
- **Propósito:** Manejo de autenticación de administradores
- **Funciones principales:**
  - `login(req, res)` - Autenticación con JWT
  - `logout(req, res)` - Invalidación de sesión
  - `verifyToken(req, res)` - Verificación de token válido

### ProductController (`productController.js`)
- **Propósito:** CRUD completo de productos
- **Funciones principales:**
  - `getAllProducts(req, res)` - Listar productos con filtros
  - `getProductById(req, res)` - Obtener producto específico
  - `createProduct(req, res)` - Crear nuevo producto
  - `updateProduct(req, res)` - Actualizar producto existente
  - `deleteProduct(req, res)` - Eliminar producto
  - `uploadProductImage(req, res)` - Subir imagen de producto

### CategoryController (`categoryController.js`)
- **Propósito:** Gestión de categorías de productos
- **Funciones principales:**
  - `getAllCategories(req, res)` - Listar todas las categorías
  - `createCategory(req, res)` - Crear nueva categoría
  - `updateCategory(req, res)` - Actualizar categoría
  - `deleteCategory(req, res)` - Eliminar categoría

### ReservationController (`reservationController.js`)
- **Propósito:** Gestión de reservas de stock del carrito
- **Funciones principales:**
  - `createReservation(req, res)` - Reservar stock para carrito
  - `extendReservation(req, res)` - Extender tiempo de reserva
  - `releaseReservation(req, res)` - Liberar reserva de stock
  - `cleanupExpiredReservations()` - Limpiar reservas expiradas

### DashboardController (`dashboardController.js`)
- **Propósito:** Estadísticas y reportes administrativos
- **Funciones principales:**
  - `getStats(req, res)` - Estadísticas generales
  - `getProductsWithStats(req, res)` - Productos con métricas
  - `getSalesReport(req, res)` - Reporte de ventas

## 🛡️ Middleware

### Auth Middleware (`auth.js`)
- **Propósito:** Verificación de autenticación JWT
- **Funcionalidad:**
  - Extrae token del header Authorization
  - Verifica validez del token
  - Decodifica información del usuario
  - Bloquea acceso no autorizado

### Upload Middleware (`upload.js`)
- **Propósito:** Manejo de subida de archivos
- **Configuración:**
  - Almacenamiento en directorio `/uploads`
  - Filtros por tipo de archivo (imágenes)
  - Límite de tamaño de archivo
  - Nombres únicos para evitar conflictos

## 🔧 Servicios

### ReservationCleanupService (`reservationCleanupService.js`)
- **Propósito:** Limpieza automática de reservas expiradas
- **Funcionalidad:**
  - Ejecuta cada 5 minutos
  - Elimina reservas expiradas
  - Libera stock reservado
  - Mantiene integridad de datos

## ⚙️ Configuración

### Variables de Entorno (`.env`)
```env
# Base de Datos
MYSQL_DATABASE=tienda
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_HOST=localhost
MYSQL_PORT=3306

# Autenticación
JWT_SECRET=eiwuhcnrhyif

# Servidor
PORT=3000
NODE_ENV=development
```

### Configuración de Base de Datos (`db.js`)
```javascript
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  logging: false, // Desactivar logs SQL en producción
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
```

## 🚀 Scripts Disponibles

### Desarrollo
```bash
npm start          # Inicia servidor en producción
npm run dev        # Inicia servidor con nodemon (desarrollo)
npm run seed       # Ejecuta script de datos de prueba
npm test           # Ejecuta tests (no implementado)
```

### Scripts de Utilidad
```bash
node src/scripts/seed-data.js              # Poblar BD con datos de prueba
node src/scripts/initializeCategories.js   # Inicializar categorías
node src/scripts/check-products.js         # Verificar integridad de productos
node src/scripts/migrate-image-urls.js     # Migrar URLs de imágenes
```

## 🔄 Flujo de Datos

### 1. Request → Middleware → Controller
```
HTTP Request → CORS → Auth Middleware → Controller → Response
```

### 2. Controller → Model → Database
```
Controller → Sequelize Model → MySQL Database → Response
```

### 3. File Upload Flow
```
Multer Middleware → File Validation → Storage → URL Generation → Database Update
```

## 🛡️ Características de Seguridad

### Autenticación JWT
- Tokens con expiración configurable
- Secret key seguro en variables de entorno
- Middleware de verificación automática
- Logout con invalidación de token

### Validación de Datos
- Validación de tipos en modelos Sequelize
- Sanitización de inputs
- Validación de archivos subidos
- Protección contra inyección SQL (ORM)

### CORS Configuration
- Configuración específica de orígenes permitidos
- Headers permitidos configurables
- Métodos HTTP específicos
- Credenciales controladas

## 📊 Sistema de Reservas de Stock

### Funcionamiento
1. **Reserva:** Al agregar producto al carrito, se reserva stock por 15 minutos
2. **Extensión:** El usuario puede extender la reserva antes de que expire
3. **Liberación:** Reservas se liberan automáticamente al expirar o manualmente
4. **Limpieza:** Servicio automático limpia reservas expiradas cada 5 minutos

### Estados de Stock
- **Stock Total:** Cantidad total disponible
- **Stock Reservado:** Cantidad temporalmente reservada
- **Stock Disponible:** Total - Reservado

## 🗄️ Gestión de Base de Datos

### Inicialización
```javascript
// Sincronización automática en desarrollo
sequelize.sync({ alter: true })
```

### Migraciones (Recomendado para Producción)
```bash
# Generar migración
npx sequelize-cli migration:generate --name create-products

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Revertir migración
npx sequelize-cli db:migrate:undo
```

### Seeders
```bash
# Generar seeder
npx sequelize-cli seed:generate --name demo-products

# Ejecutar seeders
npx sequelize-cli db:seed:all
```

## 📈 Monitoreo y Logging

### Logging Strategy
- Console logs para desarrollo
- File logs para producción
- Error tracking con stack traces
- Request/Response logging

### Health Checks
- Endpoint `/health` para verificar estado
- Verificación de conexión a BD
- Monitoreo de servicios críticos

## 🧪 Testing

### Estrategia de Testing
- **Unit Tests:** Controladores y servicios individuales
- **Integration Tests:** Endpoints completos
- **Database Tests:** Modelos y relaciones

### Configuración de Testing
```javascript
// Test database configuration
const testConfig = {
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
};
```

## 🚀 Optimizaciones de Rendimiento

### Database Optimization
- Índices en campos frecuentemente consultados
- Paginación en listados grandes
- Eager loading para relaciones
- Connection pooling

### Caching Strategy
- Cache de consultas frecuentes
- Cache de imágenes y assets estáticos
- Redis para cache distribuido (futuro)

### API Optimization
- Compresión gzip
- Rate limiting
- Response compression
- Lazy loading de datos

## 🔧 Configuración de Producción

### Environment Variables
```env
NODE_ENV=production
PORT=3000
MYSQL_HOST=production-db-host
JWT_SECRET=secure-production-secret
UPLOAD_PATH=/var/uploads
LOG_LEVEL=error
```

### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'ecommerce-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

## 📈 Próximos Pasos

### Mejoras Planificadas
1. **Redis Cache:** Implementar cache distribuido
2. **Rate Limiting:** Protección contra abuso de API
3. **API Documentation:** Swagger/OpenAPI documentation
4. **Monitoring:** APM con New Relic o similar
5. **Backup Strategy:** Backups automáticos de BD
6. **Load Balancing:** Configuración para múltiples instancias

### Refactoring Pendiente
1. **Error Handling:** Middleware global de manejo de errores
2. **Validation Layer:** Librería de validación robusta (Joi/Yup)
3. **Service Layer:** Separar lógica de negocio de controladores
4. **Repository Pattern:** Abstracción de acceso a datos
5. **Event System:** Sistema de eventos para acciones asíncronas