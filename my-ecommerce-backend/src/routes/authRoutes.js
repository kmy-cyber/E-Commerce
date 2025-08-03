// my-ecommerce-backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el login del administrador
router.post('/login', authController.adminLogin);

module.exports = router;
