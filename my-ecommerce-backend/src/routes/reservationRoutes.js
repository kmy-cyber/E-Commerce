// my-ecommerce-backend/src/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Reservar stock para un producto
router.post('/products/:id/reserve', reservationController.reserveStock);

// Obtener stock disponible para un producto
router.get('/products/:id/available-stock', reservationController.getAvailableStock);

// Liberar reservas de un carrito (todas las reservas del carrito)
router.delete('/reservations/:cartId', reservationController.releaseReservation);

// Liberar reserva específica de un producto en un carrito
router.delete('/reservations/:cartId/:productId', reservationController.releaseReservation);

// Confirmar reservas (convertir a venta)
router.post('/reservations/:cartId/confirm', reservationController.confirmReservation);

// Limpiar reservas expiradas (función de mantenimiento)
router.delete('/reservations/expired/cleanup', reservationController.cleanExpiredReservations);

module.exports = router;