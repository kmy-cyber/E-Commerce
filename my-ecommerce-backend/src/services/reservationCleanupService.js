// my-ecommerce-backend/src/services/reservationCleanupService.js
const StockReservation = require('../models/StockReservation');
const { Op } = require('sequelize');

class ReservationCleanupService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
  }

  // Limpiar reservas expiradas
  async cleanExpiredReservations() {
    try {
      const deletedCount = await StockReservation.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });

      if (deletedCount > 0) {
        console.log(`🧹 Limpieza automática: ${deletedCount} reservas expiradas eliminadas.`);
      }

      return deletedCount;
    } catch (error) {
      console.error('❌ Error en limpieza automática de reservas:', error);
      return 0;
    }
  }

  // Iniciar limpieza automática cada 5 minutos
  startAutomaticCleanup() {
    if (this.isRunning) {
      console.log('⚠️ El servicio de limpieza automática ya está ejecutándose.');
      return;
    }

    console.log('🚀 Iniciando servicio de limpieza automática de reservas...');
    
    // Ejecutar limpieza inmediatamente
    this.cleanExpiredReservations();

    // Programar limpieza cada 5 minutos (300,000 ms)
    this.intervalId = setInterval(() => {
      this.cleanExpiredReservations();
    }, 5 * 60 * 1000);

    this.isRunning = true;
    console.log('✅ Servicio de limpieza automática iniciado (cada 5 minutos).');
  }

  // Detener limpieza automática
  stopAutomaticCleanup() {
    if (!this.isRunning) {
      console.log('⚠️ El servicio de limpieza automática no está ejecutándose.');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('🛑 Servicio de limpieza automática detenido.');
  }

  // Obtener estadísticas de reservas
  async getReservationStats() {
    try {
      const now = new Date();
      
      const totalReservations = await StockReservation.count();
      const activeReservations = await StockReservation.count({
        where: {
          expiresAt: {
            [Op.gt]: now,
          },
        },
      });
      const expiredReservations = await StockReservation.count({
        where: {
          expiresAt: {
            [Op.lt]: now,
          },
        },
      });

      return {
        total: totalReservations,
        active: activeReservations,
        expired: expiredReservations,
        timestamp: now,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de reservas:', error);
      return null;
    }
  }
}

// Crear instancia singleton
const reservationCleanupService = new ReservationCleanupService();

module.exports = reservationCleanupService;