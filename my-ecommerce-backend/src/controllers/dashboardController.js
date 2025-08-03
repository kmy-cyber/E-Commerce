// my-ecommerce-backend/controllers/dashboardController.js
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { Op } = require('sequelize');

// Obtener estadísticas del dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Estadísticas básicas de productos
    const totalProducts = await Product.count();
    const lowStockProducts = await Product.count({
      where: { stock: { [Op.lte]: 5, [Op.gt]: 0 } }
    });
    const outOfStockProducts = await Product.count({
      where: { stock: 0 }
    });

    // Valor total del inventario
    const products = await Product.findAll();
    const totalInventoryValue = products.reduce((sum, product) => {
      return sum + (product.enrollmentPrice * product.stock);
    }, 0);

    // Productos por categoría
    const categoryStats = {};
    products.forEach(product => {
      if (categoryStats[product.category]) {
        categoryStats[product.category]++;
      } else {
        categoryStats[product.category] = 1;
      }
    });

    // Productos con stock bajo (para alertas)
    const lowStockList = await Product.findAll({
      where: { 
        stock: { [Op.lte]: 5, [Op.gt]: 0 } 
      },
      order: [['stock', 'ASC']],
      limit: 10
    });

    // Productos más caros
    const expensiveProducts = await Product.findAll({
      order: [['enrollmentPrice', 'DESC']],
      limit: 5
    });

    // Estadísticas de órdenes (si existen)
    let orderStats = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0
    };

    try {
      const totalOrders = await Order.count();
      const pendingOrders = await Order.count({
        where: { status: 'pending' }
      });
      const completedOrders = await Order.count({
        where: { status: 'delivered' }
      });
      
      const orders = await Order.findAll({
        where: { status: 'delivered' }
      });
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      orderStats = {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue
      };
    } catch (orderError) {
      console.log('Orders table might not exist yet, using default values');
    }

    const dashboardData = {
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
        inventoryValue: totalInventoryValue,
        categoryStats,
        lowStockList: lowStockList.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          stock: product.stock,
          price: product.enrollmentPrice
        })),
        expensiveProducts: expensiveProducts.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.enrollmentPrice
        }))
      },
      orders: orderStats,
      summary: {
        totalProducts,
        totalInventoryValue,
        lowStockAlerts: lowStockProducts,
        outOfStockAlerts: outOfStockProducts
      }
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas.' });
  }
};

// Obtener productos con stock bajo
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = req.query.threshold || 5;
    
    const lowStockProducts = await Product.findAll({
      where: { 
        stock: { [Op.lte]: threshold, [Op.gt]: 0 } 
      },
      order: [['stock', 'ASC']]
    });

    res.status(200).json(lowStockProducts);
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener productos sin stock
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const outOfStockProducts = await Product.findAll({
      where: { stock: 0 },
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json(outOfStockProducts);
  } catch (error) {
    console.error('Error al obtener productos sin stock:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener resumen de ventas por período
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['createdAt', 'DESC']]
    });

    const report = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? 
        orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      ordersByStatus: {},
      topProducts: {}
    };

    // Agrupar por estado
    orders.forEach(order => {
      if (report.ordersByStatus[order.status]) {
        report.ordersByStatus[order.status]++;
      } else {
        report.ordersByStatus[order.status] = 1;
      }
    });

    res.status(200).json(report);
  } catch (error) {
    console.error('Error al obtener reporte de ventas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};