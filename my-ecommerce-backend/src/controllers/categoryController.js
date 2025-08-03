// my-ecommerce-backend/controllers/categoryController.js
const Category = require('../models/Category');
const Product = require('../models/Product');

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener categorías.' });
  }
};

// Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Error al obtener categoría por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener la categoría.' });
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    const newCategory = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : null,
    });

    res.status(201).json({ message: 'Categoría creada exitosamente.', category: newCategory });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre.' });
    }
    
    res.status(500).json({ message: 'Error interno del servidor al crear la categoría.' });
  }
};

// Actualizar una categoría
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    await category.update({
      name: name.trim(),
      description: description ? description.trim() : null,
    });

    res.status(200).json({ message: 'Categoría actualizada exitosamente.', category });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre.' });
    }
    
    res.status(500).json({ message: 'Error interno del servidor al actualizar la categoría.' });
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    // Verificar si hay productos usando esta categoría
    const productsCount = await Product.count({
      where: { category: category.name }
    });

    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar la categoría "${category.name}" porque tiene ${productsCount} productos asociados.` 
      });
    }

    await category.destroy();

    res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar la categoría.' });
  }
};

// Obtener estadísticas de categorías
exports.getCategoryStats = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true }
    });

    const stats = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.count({
          where: { category: category.name }
        });

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          productCount,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        };
      })
    );

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas de categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas.' });
  }
};