// my-ecommerce-backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateAdmin } = require('../middleware/auth');

// Rutas públicas (para clientes)
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);

// Rutas protegidas (solo administradores)
router.post('/admin/categories', authenticateAdmin, categoryController.createCategory);
router.put('/admin/categories/:id', authenticateAdmin, categoryController.updateCategory);
router.delete('/admin/categories/:id', authenticateAdmin, categoryController.deleteCategory);
router.get('/admin/categories/stats/all', authenticateAdmin, categoryController.getCategoryStats);

module.exports = router;