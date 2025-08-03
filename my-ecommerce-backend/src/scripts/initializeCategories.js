// my-ecommerce-backend/scripts/initializeCategories.js
const { sequelize } = require('../config/db');
const Category = require('../models/Category');

const defaultCategories = [
  { name: 'Electrónicos', description: 'Dispositivos y gadgets tecnológicos' },
  { name: 'Ropa', description: 'Vestimenta y accesorios de moda' },
  { name: 'Aseo', description: 'Productos de higiene personal' },
  { name: 'Comida', description: 'Alimentos y bebidas' },
  { name: 'Otros', description: 'Productos diversos' },
];

const initializeCategories = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    // Verificar si ya existen categorías
    const existingCategories = await Category.count();
    
    if (existingCategories === 0) {
      console.log('Inicializando categorías por defecto...');
      
      for (const categoryData of defaultCategories) {
        await Category.create(categoryData);
        console.log(`Categoría "${categoryData.name}" creada.`);
      }
      
      console.log('Categorías inicializadas exitosamente.');
    } else {
      console.log(`Ya existen ${existingCategories} categorías en la base de datos.`);
    }
  } catch (error) {
    console.error('Error al inicializar categorías:', error);
  }
};

module.exports = { initializeCategories };