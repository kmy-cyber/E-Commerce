// scripts/runMigration.js
const { sequelize } = require('../config/db');
const migration = require('../migrations/add-wholesale-fields');

async function runMigration() {
  try {
    console.log('Ejecutando migración para campos mayoristas...');
    
    // Ejecutar la migración
    await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
    
    console.log('✅ Migración completada exitosamente');
    console.log('Los siguientes campos han sido agregados a la tabla Products:');
    console.log('- wholesalePrice: Precio mayorista');
    console.log('- minOrderQuantity: Cantidad mínima de pedido');
    console.log('- unit: Unidad de medida');
    console.log('- packSize: Tamaño del paquete/caja');
    console.log('- enrollmentPrice: Cambiado a DECIMAL para mayor precisión');
    
  } catch (error) {
    console.error('❌ Error ejecutando la migración:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;