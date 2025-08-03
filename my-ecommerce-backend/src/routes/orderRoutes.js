// my-ecommerce-backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateAdmin } = require('../middleware/auth');

// Rutas públicas (cliente)
// Crear orden desde reservas (cliente confirma pedido)
router.post('/reservations/:cartId/create-order', orderController.createOrderFromReservations);

// Rutas protegidas (administrador)
// Obtener órdenes pendientes
router.get('/orders/pending', authenticateAdmin, orderController.getPendingOrders);

// Obtener todas las órdenes
router.get('/orders', authenticateAdmin, orderController.getAllOrders);

// Confirmar orden (administrador)
router.post('/orders/:orderId/confirm', authenticateAdmin, orderController.confirmOrder);

// Rechazar orden (administrador)
router.post('/orders/:orderId/reject', authenticateAdmin, orderController.rejectOrder);

module.exports = router;