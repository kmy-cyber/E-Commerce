// my-ecommerce-backend/src/controllers/reservationController.js
const StockReservation = require("../models/StockReservation");
const Product = require("../models/Product");
const { Op } = require("sequelize");

// Reservar stock para un producto
exports.reserveStock = async (req, res) => {
  const { cartId, quantity, saleType } = req.body;
  const productId = req.params.id;

  try {
      console.log('Buscando producto con ID:', productId);
      const product = await Product.findByPk(productId);
      if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado.' });
      }

      // Validación de cantidad mínima
      const minOrderQuantity = saleType === 'wholesale' ? product.wholesaleminOrderQuantity : product.retailminOrderQuantity;
      if (quantity < minOrderQuantity) {
          return res.status(400).json({ message: `La cantidad mínima para este tipo de venta es ${minOrderQuantity} ${product.unitOfSale}.` });
      }

      // Calcular la fecha de expiración (30 minutos desde ahora)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      const existingReservation = await StockReservation.findOne({
          where: { cartId, productId }
      });

      console.log('Fecha de expiración:', expiresAt);
      console.log('Datos de la reserva:', {
          cartId,
          productId,
          quantity,
          expiresAt
      });

      if (existingReservation) {
          console.log('Actualizando reserva existente...');
          await existingReservation.update({ 
              quantity: existingReservation.quantity + quantity,
              expiresAt
          });
          console.log('Reserva actualizada');
      } else {
          console.log('Creando nueva reserva...');
          const newReservation = await StockReservation.create({ 
              cartId, 
              productId, 
              quantity,
              expiresAt
          });
          console.log('Nueva reserva creada:', newReservation.toJSON());
      }

      res.status(200).json({ message: 'Stock reservado exitosamente' });
  } catch (error) {
      console.error('Error al reservar stock:', error);
      res.status(500).json({ message: 'Error al reservar stock', error });
  }
};

// Liberar reservas de un carrito
exports.releaseReservation = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    let whereCondition = { cartId };

    // Si se especifica un productId, solo liberar esa reserva específica
    if (productId) {
      whereCondition.productId = productId;
    }

    // Eliminar reservas
    const deletedCount = await StockReservation.destroy({
      where: whereCondition,
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No se encontraron reservas para liberar.",
      });
    }

    res.status(200).json({
      message: `${deletedCount} reserva(s) liberada(s) exitosamente.`,
      releasedCount: deletedCount,
    });
  } catch (error) {
    console.error("Error al liberar reservas:", error);
    res.status(500).json({
      message: "Error interno del servidor al liberar reservas.",
    });
  }
};

// Confirmar reservas (DEPRECATED - usar createOrderFromReservations en su lugar)
exports.confirmReservation = async (req, res) => {
  return res.status(400).json({
    message: "Esta función ha sido deshabilitada. Use /api/reservations/:cartId/create-order para crear una orden que requiere confirmación del administrador.",
    deprecated: true
  });
};

// Obtener stock disponible para un producto
exports.getAvailableStock = async (req, res) => {
  try {
    const { id: productId } = req.params;

    // Buscar el producto
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Calcular reservas activas
    const activeReservations =
      (await StockReservation.sum("quantity", {
        where: {
          productId,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
      })) || 0;

    const availableStock = Math.max(0, product.stock - activeReservations);

    res.status(200).json({
      productId: parseInt(productId),
      totalStock: product.stock,
      reservedStock: activeReservations,
      availableStock,
    });
  } catch (error) {
    console.error("Error al obtener stock disponible:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener stock disponible.",
    });
  }
};

// Limpiar reservas expiradas (función de mantenimiento)
exports.cleanExpiredReservations = async (req, res) => {
  try {
    const deletedCount = await StockReservation.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });

    res.status(200).json({
      message: `${deletedCount} reservas expiradas eliminadas.`,
      deletedCount,
    });
  } catch (error) {
    console.error("Error al limpiar reservas expiradas:", error);
    res.status(500).json({
      message: "Error interno del servidor al limpiar reservas expiradas.",
    });
  }
};
