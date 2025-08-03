# My E-commerce Backend

Backend para aplicación de e-commerce construido con Node.js, Express, Sequelize y MySQL.

## Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL Server (versión 5.7 o superior)
- npm o yarn

## Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar MySQL:**
   - Asegúrate de que MySQL esté ejecutándose
   - Crea la base de datos ejecutando el script:
   ```bash
   mysql -u root -p < scripts/init-db.sql
   ```

3. **Configurar variables de entorno:**
   - El archivo `.env` ya está configurado con valores por defecto
   - Actualiza las credenciales si es necesario:
   ```
   MYSQL_DATABASE=tienda
   MYSQL_USER=root
   MYSQL_PASSWORD=root
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   JWT_SECRET=eiwuhcnrhyif
   ```

## Uso

1. **Iniciar el servidor:**
   ```bash
   npm start
   ```

2. **El servidor estará disponible en:**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Productos (Público)
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID

### Autenticación
- `POST /api/auth/login` - Login de administrador

### Administración (Requiere autenticación)
- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/:id` - Actualizar producto
- `DELETE /api/admin/products/:id` - Eliminar producto

## Estructura del Proyecto

```
my-ecommerce-backend/
├── src/                   # Código fuente principal
│   ├── config/
│   │   └── db.js         # Configuración de base de datos
│   ├── controllers/
│   │   ├── authController.js  # Controladores de autenticación
│   │   ├── categoryController.js # Controladores de categorías
│   │   ├── dashboardController.js # Controladores del dashboard
│   │   └── productController.js # Controladores de productos
│   ├── middleware/
│   │   ├── auth.js       # Middleware de autenticación
│   │   └── upload.js     # Middleware de subida de archivos
│   ├── models/
│   │   ├── Category.js   # Modelo de categoría
│   │   ├── Order.js      # Modelo de orden
│   │   ├── OrderItem.js  # Modelo de item de orden
│   │   └── Product.js    # Modelo de producto
│   ├── routes/
│   │   ├── authRoutes.js # Rutas de autenticación
│   │   ├── categoryRoutes.js # Rutas de categorías
│   │   ├── dashboardRoutes.js # Rutas del dashboard
│   │   └── productRoutes.js # Rutas de productos
│   ├── scripts/
│   │   ├── initializeCategories.js # Script de inicialización de categorías
│   │   └── seed-data.js  # Script de datos de prueba
│   ├── server.js         # Servidor principal
│   └── test-routes.js    # Rutas de prueba temporales
├── uploads/              # Directorio de archivos subidos
├── .env                  # Variables de entorno
├── .gitignore
├── package.json
├── server.js             # Punto de entrada (redirige a src/server.js)
└── README.md
```

## Notas de Desarrollo

- El servidor usa Sequelize ORM para interactuar con MySQL
- Las tablas se crean automáticamente al iniciar el servidor
- El modo `alter: true` está habilitado para desarrollo
- Para producción, considera usar migraciones de Sequelize
- **Nueva estructura:** Todo el código fuente principal está ahora organizado en la carpeta `src/`
- El archivo `server.js` en la raíz actúa como punto de entrada que redirige a `src/server.js`