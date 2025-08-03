// Script para migrar URLs de imágenes de relativas a absolutas
const { sequelize, connectDB } = require('../config/db');
const Product = require('../models/Product');

const migrateImageUrls = async () => {
  try {
    await connectDB();
    
    // Obtener todos los productos
    const products = await Product.findAll();
    
    console.log(`Encontrados ${products.length} productos para revisar...`);
    
    let updatedCount = 0;
    const baseUrl = 'http://localhost:3002'; // URL base del backend
    
    for (const product of products) {
      if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
        // Convertir URL relativa a absoluta
        const newImageUrl = `${baseUrl}${product.imageUrl}`;
        
        await product.update({ imageUrl: newImageUrl });
        console.log(`Actualizado producto "${product.name}": ${product.imageUrl} -> ${newImageUrl}`);
        updatedCount++;
      }
    }
    
    console.log(`\nMigración completada. ${updatedCount} productos actualizados.`);
    process.exit(0);
    
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

migrateImageUrls();