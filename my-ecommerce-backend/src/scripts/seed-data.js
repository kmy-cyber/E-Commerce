// Script para poblar la base de datos con datos de prueba
const { sequelize, connectDB } = require('../config/db');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: "Laptop Gaming",
    description: "Laptop de alto rendimiento para gaming con procesador Intel i7 y tarjeta gráfica RTX 3060",
    imageUrl: "https://via.placeholder.com/300x200?text=Laptop+Gaming",
    enrollmentPrice: 1299.99,
    stock: 15,
    category: "Electrónicos"
  },
  {
    name: "Smartphone Pro",
    description: "Teléfono inteligente con cámara de 108MP y pantalla AMOLED de 6.7 pulgadas",
    imageUrl: "https://via.placeholder.com/300x200?text=Smartphone+Pro",
    enrollmentPrice: 899.99,
    stock: 25,
    category: "Electrónicos"
  },
  {
    name: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con cancelación de ruido activa y 30 horas de batería",
    imageUrl: "https://via.placeholder.com/300x200?text=Auriculares+BT",
    enrollmentPrice: 199.99,
    stock: 50,
    category: "Audio"
  },
  {
    name: "Camiseta Deportiva",
    description: "Camiseta transpirable para actividades deportivas, disponible en varios colores",
    imageUrl: "https://via.placeholder.com/300x200?text=Camiseta+Deportiva",
    enrollmentPrice: 29.99,
    stock: 100,
    category: "Ropa"
  },
  {
    name: "Libro de Programación",
    description: "Guía completa para aprender JavaScript moderno y desarrollo web",
    imageUrl: "https://via.placeholder.com/300x200?text=Libro+JS",
    enrollmentPrice: 39.99,
    stock: 30,
    category: "Libros"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: true }); // Esto recreará las tablas
    
    console.log('Creando productos de prueba...');
    await Product.bulkCreate(sampleProducts);
    
    console.log('✅ Base de datos poblada exitosamente con datos de prueba');
    console.log(`📦 Se crearon ${sampleProducts.length} productos`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar solo si este archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleProducts };