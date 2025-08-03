// migrations/add-wholesale-fields.js
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar campos para ventas mayoristas
    await queryInterface.addColumn('Products', 'wholesalePrice', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Precio mayorista'
    });

    await queryInterface.addColumn('Products', 'minOrderQuantity', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Cantidad mínima de pedido'
    });

    await queryInterface.addColumn('Products', 'unit', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unidad',
      comment: 'Unidad de medida (unidad, caja, paquete, etc.)'
    });

    await queryInterface.addColumn('Products', 'packSize', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: 'Cantidad de unidades por paquete/caja'
    });

    // Cambiar el tipo de enrollmentPrice a DECIMAL para mayor precisión
    await queryInterface.changeColumn('Products', 'enrollmentPrice', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio unitario/retail'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir los cambios
    await queryInterface.removeColumn('Products', 'wholesalePrice');
    await queryInterface.removeColumn('Products', 'minOrderQuantity');
    await queryInterface.removeColumn('Products', 'unit');
    await queryInterface.removeColumn('Products', 'packSize');
    
    // Revertir el tipo de enrollmentPrice a FLOAT
    await queryInterface.changeColumn('Products', 'enrollmentPrice', {
      type: DataTypes.FLOAT,
      allowNull: false
    });
  }
};