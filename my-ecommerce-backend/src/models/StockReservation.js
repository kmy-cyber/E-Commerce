// my-ecommerce-backend/src/models/StockReservation.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Product = require('./Product');

const StockReservation = sequelize.define('StockReservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cartId: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  reservedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'stock_reservations',
  timestamps: true,
  indexes: [
    {
      fields: ['cartId'],
    },
    {
      fields: ['productId'],
    },
    {
      fields: ['expiresAt'],
    },
  ],
});

// Definir asociaciones
StockReservation.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

Product.hasMany(StockReservation, {
  foreignKey: 'productId',
  as: 'reservations',
});

module.exports = StockReservation;