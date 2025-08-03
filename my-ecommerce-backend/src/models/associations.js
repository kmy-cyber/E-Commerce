// my-ecommerce-backend/src/models/associations.js
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Product = require('./Product');

// Definir asociaciones
const setupAssociations = () => {
  // Order - OrderItem (One to Many)
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE'
  });
  
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  // Product - OrderItem (One to Many)
  Product.hasMany(OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems'
  });
  
  OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });

  // Las asociaciones de StockReservation ya están definidas en su modelo
};

module.exports = { setupAssociations };