// my-ecommerce-backend/src/controllers/orderController.js
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const StockReservation = require('../models/StockReservation');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Generar número de orden único
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-6)}${random}`;
};

// Crear orden desde reservas (cliente confirma pedido)
exports.createOrderFromReservations = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { cartId } = req.params;
    const { customerName, customerEmail, customerPhone, shippingAddress, notes } = req.body;

    // Validar datos requeridos
    if (!customerName || !customerEmail) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Nombre y email del cliente son obligatorios.'
      });
    }

    // Buscar todas las reservas activas para este carrito
    const reservations = await StockReservation.findAll({
      where: {
        cartId,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
      transaction
    });

    if (reservations.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        message: 'No se encontraron reservas activas para este carrito.'
      });
    }

    // Calcular total
    const totalAmount = reservations.reduce((total, reservation) => {
      return total + (reservation.product.enrollmentPrice * reservation.quantity);
    }, 0);

    // Crear la orden con estado 'pending'
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
      status: 'pending',
      shippingAddress,
      notes
    }, { transaction });

    // Crear los items de la orden
    const orderItems = [];
    for (const reservation of reservations) {
      const orderItem = await OrderItem.create({
        orderId: order.id,
        productId: reservation.productId,
        quantity: reservation.quantity,
        price: reservation.product.enrollmentPrice,
        productName: reservation.product.name
      }, { transaction });
      orderItems.push(orderItem);
    }

    // NO eliminamos las reservas aún - las mantenemos hasta que el admin confirme
    // Solo actualizamos su tiempo de expiración para que no expiren automáticamente
    await StockReservation.update({
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    }, {
      where: { cartId },
      transaction
    });

    await transaction.commit();

    res.status(201).json({
      message: 'Orden creada exitosamente. Esperando confirmación del administrador.',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        items: orderItems
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear orden:', error);
    res.status(500).json({
      message: 'Error interno del servidor al crear la orden.'
    });
  }
};

// Obtener órdenes pendientes (para administrador)
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        status: 'pending'
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      orders
    });

  } catch (error) {
    console.error('Error al obtener órdenes pendientes:', error);
    res.status(500).json({
      message: 'Error interno del servidor al obtener órdenes pendientes.'
    });
  }
};

// Confirmar orden (administrador confirma y descuenta stock)
exports.confirmOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { orderId } = req.params;

    // Buscar la orden
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        message: 'Orden no encontrada.'
      });
    }

    if (order.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Solo se pueden confirmar órdenes pendientes.'
      });
    }

    // Verificar stock disponible para todos los productos
    for (const item of order.items) {
      if (item.product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Stock insuficiente para ${item.product.name}. Solo hay ${item.product.stock} unidades disponibles.`,
          productId: item.product.id,
          availableStock: item.product.stock
        });
      }
    }

    // Descontar stock de todos los productos
    for (const item of order.items) {
      await item.product.update({
        stock: item.product.stock - item.quantity
      }, { transaction });
    }

    // Actualizar estado de la orden
    await order.update({
      status: 'confirmed'
    }, { transaction });

    // Eliminar las reservas asociadas (buscar por productos y cantidades)
    for (const item of order.items) {
      await StockReservation.destroy({
        where: {
          productId: item.productId,
          quantity: item.quantity
        },
        limit: 1,
        transaction
      });
    }

    await transaction.commit();

    res.status(200).json({
      message: 'Orden confirmada exitosamente. Stock actualizado.',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: 'confirmed',
        totalAmount: order.totalAmount
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al confirmar orden:', error);
    res.status(500).json({
      message: 'Error interno del servidor al confirmar orden.'
    });
  }
};

// Rechazar orden (administrador rechaza y libera reservas)
exports.rejectOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    // Buscar la orden
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        message: 'Orden no encontrada.'
      });
    }

    if (order.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Solo se pueden rechazar órdenes pendientes.'
      });
    }

    // Actualizar estado de la orden
    await order.update({
      status: 'cancelled',
      notes: reason ? `Rechazada: ${reason}` : 'Rechazada por el administrador'
    }, { transaction });

    // Liberar las reservas asociadas
    for (const item of order.items) {
      await StockReservation.destroy({
        where: {
          productId: item.productId,
          quantity: item.quantity
        },
        limit: 1,
        transaction
      });
    }

    await transaction.commit();

    res.status(200).json({
      message: 'Orden rechazada exitosamente. Reservas liberadas.',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: 'cancelled'
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al rechazar orden:', error);
    res.status(500).json({
      message: 'Error interno del servidor al rechazar orden.'
    });
  }
};

// Obtener todas las órdenes (para administrador)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const whereCondition = {};
    if (status) {
      whereCondition.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({
      message: 'Error interno del servidor al obtener órdenes.'
    });
  }
};

module.exports = exports;