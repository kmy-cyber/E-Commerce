// scripts/initializeWholesaleProducts.js
const Product = require('../models/Product');
const { sequelize } = require('../config/db');

const wholesaleProducts = [
  {
    name: 'Papel Higiénico Premium - Caja x24',
    description: 'Papel higiénico de alta calidad, suave y resistente. Ideal para hoteles, oficinas y comercios.',
    imageUrl: 'https://placehold.co/300x300/ADD8E6/000000?text=Papel+Higiénico',
    enrollmentPrice: 2.50, // Precio por unidad
    wholesalePrice: 2.00,  // Precio mayorista por unidad
    minOrderQuantity: 24,  // Mínimo 24 unidades (1 caja)
    stock: 500,
    c