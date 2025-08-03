// Script para verificar las URLs de imágenes de todos los productos
const { sequelize, connectDB } = require('../config/db');
const Product = require('../models/Product');

const checkProducts = async () => {
  try {
    await connectDB();
    
    // Obtener todos los productos
    const products = await Product.findAll();
    
    console.log(`\n=== PRODUCTOS EN LA BASE DE DATOS ===`);
    console.log(`Total de productos: ${products.length}\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Categoría: ${product.category}`);
      console.log(`   Precio: $${product.enrollmentPrice}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   URL de imagen: ${product.imageUrl}`);
      console.log(`   Creado: ${product.createdAt}`);
      console.log('');
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error al consultar productos:', error);
    process.exit(1);
  }
};

checkProducts();