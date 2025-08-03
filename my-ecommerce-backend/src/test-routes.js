// test-routes.js - Rutas temporales para probar la carga de imágenes sin autenticación
const express = require("express");
const router = express.Router();
const productController = require("./controllers/productController");
const upload = require("./middleware/upload");

// Ruta de prueba para crear producto con imagen (SIN autenticación)
router.post("/test/products", upload.single('image'), productController.addProduct);

// Ruta de prueba para actualizar producto con imagen (SIN autenticación)
router.put("/test/products/:id", upload.single('image'), productController.updateProduct);

module.exports = router;