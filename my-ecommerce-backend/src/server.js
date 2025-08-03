// my-ecommerce-backend/src/server.js
const express = require('express');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const StockReservation = require('./models/StockReservation');
const { setupAssociations } = require('./models/associations');
const { initializeCategories } = require('./scripts/initializeCategories');
const reservationCleanupService = require('./services/reservationCleanupService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('uploads'));

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const testRoutes = require('./test-routes'); // Rutas de prueba temporales

app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', reservationRoutes);
app.use('/api', orderRoutes);
app.use('/api', testRoutes); // Rutas de prueba sin autenticación

const startServer = async () => {
  await connectDB(); // Connect to the database first
  try {
    // Configurar asociaciones entre modelos
    setupAssociations();
    
    // This will create the table if it doesn't exist (and do nothing if it already exists)
    // For development, `alter: true` can be useful to update tables without dropping data,
    // but for production, use migrations.
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
    
    // Inicializar categorías por defecto
    await initializeCategories();
    
    // Iniciar servicio de limpieza automática de reservas
    reservationCleanupService.startAutomaticCleanup();
    
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    process.exit(1);
  }
};

startServer();