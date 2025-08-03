// controllers/productController.js
const Product = require('../models/Product');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

// Agregar un nuevo producto (solo administradores)
exports.addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            enrollmentPrice,
            wholesalePrice,
            minOrderQuantity,
            stock,
            category,
            unit,
            packSize
        } = req.body;

        // Validación básica
        if (!name || !enrollmentPrice || !stock || !category) {
            return res.status(400).json({
                message: 'Nombre, precio, stock y categoría son obligatorios.'
            });
        }

        if (enrollmentPrice <= 0 || stock < 0) {
            return res.status(400).json({
                message: 'El precio debe ser mayor a 0 y el stock no puede ser negativo.'
            });
        }

        // Manejar la imagen
        let imageUrl = '';
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (req.file) {
            imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        } else {
            imageUrl = `${baseUrl}/uploads/default-product.svg`;
        }

        // Crear el producto
        const newProduct = await Product.create({
            name,
            description: description || '',
            imageUrl,
            enrollmentPrice: parseFloat(enrollmentPrice),
            wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : 0,
            minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity) : 1,
            stock: parseInt(stock),
            category,
            unit: unit || 'unidad',
            packSize: packSize ? parseInt(packSize) : 1
        });

        res.status(201).json({
            message: 'Producto creado exitosamente.',
            product: newProduct
        });
    } catch (error) {
        console.error('Error al crear producto:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Ya existe un producto con ese nombre.'
            });
        }

        res.status(500).json({
            message: 'Error interno del servidor al crear el producto.'
        });
    }
};

// Actualizar un producto existente (solo administradores)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            enrollmentPrice,
            wholesalePrice,
            minOrderQuantity,
            stock,
            category,
            unit,
            packSize
        } = req.body;

        // Buscar el producto
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Validación básica
        if (!name || !enrollmentPrice || !stock || !category) {
            return res.status(400).json({
                message: 'Nombre, precio, stock y categoría son obligatorios.'
            });
        }

        if (enrollmentPrice <= 0 || stock < 0) {
            return res.status(400).json({
                message: 'El precio debe ser mayor a 0 y el stock no puede ser negativo.'
            });
        }

        // Manejar la imagen
        let imageUrl = product.imageUrl;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (req.file) {
            imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;
            
            // Opcional: eliminar la imagen anterior si era un archivo local
            const fs = require('fs');
            const path = require('path');
            if (product.imageUrl && product.imageUrl.includes('/uploads/')) {
                const urlPath = product.imageUrl.substring(product.imageUrl.indexOf('/uploads/'));
                const oldImagePath = path.join(__dirname, '../..', urlPath);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }

        // Actualizar el producto
        await product.update({
            name,
            description: description || '',
            imageUrl,
            enrollmentPrice: parseFloat(enrollmentPrice),
            wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : 0,
            minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity) : 1,
            stock: parseInt(stock),
            category,
            unit: unit || 'unidad',
            packSize: packSize ? parseInt(packSize) : 1
        });

        res.status(200).json({
            message: 'Producto actualizado exitosamente.',
            product
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Ya existe un producto con ese nombre.'
            });
        }

        res.status(500).json({
            message: 'Error interno del servidor al actualizar el producto.'
        });
    }
};

// Eliminar un producto (solo administradores)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Eliminar la imagen del servidor si es un archivo local
        const fs = require('fs');
        const path = require('path');
        if (product.imageUrl && product.imageUrl.includes('/uploads/')) {
            const urlPath = product.imageUrl.substring(product.imageUrl.indexOf('/uploads/'));
            const imagePath = path.join(__dirname, '../..', urlPath);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.destroy();
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            message: 'Error interno del servidor al eliminar el producto.'
        });
    }
};

// Actualizar stock del producto (para carrito)
exports.updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: 'La cantidad debe ser mayor a 0.'
            });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`,
                availableStock: product.stock
            });
        }

        const newStock = product.stock - quantity;
        await product.update({ stock: newStock });

        res.status(200).json({
            message: 'Stock actualizado exitosamente.',
            product: {
                id: product.id,
                name: product.name,
                previousStock: product.stock,
                newStock: newStock,
                quantityReduced: quantity
            }
        });
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({
            message: 'Error interno del servidor al actualizar el stock.'
        });
    }
};

// Restaurar stock del producto (cuando se elimina del carrito)
exports.restoreProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: 'La cantidad debe ser mayor a 0.'
            });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        const newStock = product.stock + quantity;
        await product.update({ stock: newStock });

        res.status(200).json({
            message: 'Stock restaurado exitosamente.',
            product: {
                id: product.id,
                name: product.name,
                previousStock: product.stock,
                newStock: newStock,
                quantityRestored: quantity
            }
        });
    } catch (error) {
        console.error('Error al restaurar stock:', error);
        res.status(500).json({
            message: 'Error interno del servidor al restaurar el stock.'
        });
    }
};