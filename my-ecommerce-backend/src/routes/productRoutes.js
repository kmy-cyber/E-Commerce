// my-ecommerce-backend/routes/productRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticateAdmin } = require("../middleware/auth"); // Importa el middleware de autenticación
const upload = require("../middleware/upload"); // Importa el middleware de carga de archivos

// Rutas del módulo cliente
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id/stock", productController.updateProductStock);
router.put("/products/:id/restore-stock", productController.restoreProductStock);

// Rutas del módulo de administración (protegidas)
router.post("/admin/products", authenticateAdmin, upload.single('image'), productController.addProduct);
router.put(
  "/admin/products/:id",
  authenticateAdmin,
  upload.single('image'),
  productController.updateProduct
);
router.delete(
  "/admin/products/:id",
  authenticateAdmin,
  productController.deleteProduct
);

// Middleware para manejar errores de multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. Máximo 5MB.' });
    }
  }
  if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({ message: 'Solo se permiten archivos de imagen.' });
  }
  next(error);
});

module.exports = router;
