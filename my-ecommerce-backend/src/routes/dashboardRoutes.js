// my-ecommerce-backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateAdmin } = require('../middleware/auth');

// Todas las rutas del dashboard requieren autenticación de administrador
router.get('/admin/dashboard/stats', authenticateAdmin, dashboardController.getDashboardStats);
router.get('/admin/dashboard/low-stock', authenticateAdmin, dashboardController.getLowStockProducts);
router.get('/admin/dashboard/out-of-stock', authenticateAdmin, dashboardController.getOutOfStockProducts);
router.get('/admin/dashboard/sales-report', authenticateAdmin, dashboardController.getSalesReport);

module.exports = router;